import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {
  epicToMilestone,
  featureRiskOverrides,
  labels,
  legacyEpic,
  milestones,
  repository,
  sharedDefinitionOfDone,
} from './project-config.mjs';

const apply = process.argv.includes('--apply');
const previousFeatures = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'feature_list.json'), 'utf8'),
).features;
const previousLabelsByFeature = new Map(
  previousFeatures.map((feature) => [feature.id, feature.labels ?? []]),
);
const gh = (args, input) => execFileSync('gh', args, {
  encoding: 'utf8',
  input: input === undefined ? undefined : JSON.stringify(input),
  stdio: ['pipe', 'pipe', 'pipe'],
}).trim();

const request = (method, endpoint, payload) => JSON.parse(gh(['api', '-X', method, endpoint, ...(payload ? ['--input', '-'] : [])], payload));
const log = (message) => console.log(`${apply ? 'APPLY' : 'PLAN'}: ${message}`);
const normalize = (issue) => {
  const names = issue.labels.map((label) => label.name);
  const featureId = issue.body?.match(/<!-- feature-id:(mvp-\d{3}) -->/)?.[1];
  const previousLabels = previousLabelsByFeature.get(featureId) ?? [];
  const migrationLabels = names.some((name) => name.startsWith('phase:') || name.startsWith('area:'))
    ? names
    : previousLabels;
  const phase = names.find((name) => name.startsWith('phase:'))?.slice(6);
  const migrationPhase = migrationLabels.find((name) => name.startsWith('phase:'))?.slice(6);
  const epic = names.find((name) => name.startsWith('epic:'))?.slice(5) ?? legacyEpic[phase ?? migrationPhase];
  if (!epic) throw new Error(`#${issue.number} has no known epic or legacy phase`);
  const platform = new Set(names.filter((name) => name.startsWith('platform:')));
  if (migrationLabels.some((name) => ['area:watch'].includes(name))) platform.add('platform:watch');
  if (migrationLabels.some((name) => ['area:android', 'area:mobile', 'area:ui'].includes(name))) platform.add('platform:mobile');
  if (migrationLabels.some((name) => ['area:backend', 'area:gcp', 'area:database'].includes(name))) platform.add('platform:api');
  const risk = new Set(names.filter((name) => name.startsWith('risk:')));
  if (migrationLabels.some((name) => ['area:watch', 'area:android', 'area:health-data', 'area:ai'].includes(name))) risk.add('risk:integration');
  if (migrationLabels.some((name) => ['area:health-data', 'area:health-profile', 'area:health-safety', 'area:nutrition'].includes(name))) risk.add('risk:health');
  if (migrationLabels.some((name) => [
    'area:auth',
    'area:security',
    'area:health-data',
    'area:health-profile',
    'area:health-safety',
    'area:nutrition',
    'area:ai',
  ].includes(name))) risk.add('risk:privacy');
  for (const label of featureRiskOverrides[featureId] ?? []) risk.add(label);
  const priority = names.find((name) => name.startsWith('priority:'));
  if (!priority) throw new Error(`#${issue.number} has no priority label`);
  const status = names.find((name) => name.startsWith('status:')) ?? 'status:ready';
  const type = names.find((name) => name.startsWith('type:')) ?? (epic === 'discovery' ? 'type:spike' : 'type:feature');
  return {
    epic,
    labels: [priority, `epic:${epic}`, type, status, ...risk, ...platform].sort(),
    milestone: epicToMilestone[epic],
  };
};

const replaceDoD = (body) => {
  const next = body.replace(/^## (Definition of Done|Definici.n de terminado)[\s\S]*$/m, sharedDefinitionOfDone);
  return next === body ? `${body.trim()}\n\n${sharedDefinitionOfDone}\n` : `${next.trim()}\n`;
};

gh(['auth', 'status']);
const existingLabels = new Set(JSON.parse(gh(['api', `repos/${repository}/labels?per_page=100`])).map((label) => label.name));
for (const label of labels) {
  if (!existingLabels.has(label.name)) {
    log(`create label ${label.name}`);
    if (apply) request('POST', `repos/${repository}/labels`, label);
  }
}

const existingMilestones = JSON.parse(gh(['api', `repos/${repository}/milestones?state=all&per_page=100`]));
const milestoneNumbers = new Map(existingMilestones.map((milestone) => [milestone.title, milestone.number]));
for (const [title, description] of milestones) {
  if (!milestoneNumbers.has(title)) {
    log(`create milestone ${title}`);
    if (apply) milestoneNumbers.set(title, request('POST', `repos/${repository}/milestones`, { title, description }).number);
  }
}

const issues = JSON.parse(gh(['api', `repos/${repository}/issues?state=all&per_page=100`])).filter((issue) => !issue.pull_request);
for (const issue of issues) {
  if (!/<!-- feature-id:mvp-\d{3} -->/.test(issue.body ?? '')) continue;
  const target = normalize(issue);
  const body = replaceDoD(issue.body ?? '');
  const milestone = milestoneNumbers.get(target.milestone);
  const currentLabels = issue.labels.map((label) => label.name).sort();
  const labelsMatch = currentLabels.join(',') === target.labels.join(',');
  const milestoneMatches = issue.milestone?.title === target.milestone;
  const bodyMatches = body.trimEnd() === (issue.body ?? '').trimEnd();
  if (labelsMatch && milestoneMatches && bodyMatches) continue;
  log(`#${issue.number} labels=${target.labels.join(',')} milestone=${target.milestone}`);
  if (apply) request('PATCH', `repos/${repository}/issues/${issue.number}`, { labels: target.labels, milestone, body });
}

for (const label of existingLabels) {
  if (!label.startsWith('phase:') && !label.startsWith('area:')) continue;
  log(`delete obsolete label ${label}`);
  if (apply) gh(['api', '-X', 'DELETE', `repos/${repository}/labels/${encodeURIComponent(label)}`]);
}

console.log(apply ? 'OK: GitHub project normalized' : 'Dry run only. Re-run with --apply to write changes.');
