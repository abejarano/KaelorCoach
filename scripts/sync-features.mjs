import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import {
  epicToMilestone,
  labels as configuredLabels,
  repository,
  sharedDefinitionOfDone,
} from './project-config.mjs';

const root = process.cwd();
const publicMode = process.argv.includes('--public');
const checkMode = process.argv.includes('--check');
const featureListPath = path.join(root, 'feature_list.json');
const canonicalLabelNames = new Set(configuredLabels.map((label) => label.name));

const oneLabel = (labels, prefix, issue) => {
  const matches = labels.filter((label) => label.startsWith(prefix));
  if (matches.length !== 1) throw new Error(`#${issue.number} must have exactly one ${prefix} label`);
  return matches[0].slice(prefix.length);
};

export const dependencies = (body) => {
  const section = body.match(
    /^## Dependencias[ \t]*\r?\n(?:\r?\n)?([\s\S]*?)(?=\r?\n## |(?![\s\S]))/m,
  )?.[1] ?? '';
  return [...section.matchAll(/`(mvp-\d{3})`/g)].map((match) => match[1]);
};

const status = (issue, labels) => {
  if (issue.state === 'closed') return 'done';
  if (labels.includes('status:in-progress')) return 'inprogress';
  if (labels.includes('status:blocked')) return 'blocked';
  return 'pending';
};

const validateIssue = (issue, labels) => {
  const body = issue.body ?? '';
  const id = body.match(/<!-- feature-id:(mvp-\d{3}) -->/)?.[1];
  if (!id) return null;
  const epic = oneLabel(labels, 'epic:', issue);
  const expectedMilestone = epicToMilestone[epic];
  if (!expectedMilestone) throw new Error(`#${issue.number} has an unknown epic ${epic}`);
  for (const prefix of ['priority:', 'type:', 'status:']) oneLabel(labels, prefix, issue);
  for (const label of labels) {
    if (!canonicalLabelNames.has(label)) throw new Error(`#${issue.number} uses unknown or legacy label ${label}`);
  }
  const headings = [...body.matchAll(/^## (.+)$/gm)].map((match) => match[1]);
  const doDCount = headings.filter((heading) => heading === 'Definition of Done').length;
  if (doDCount !== 1 || headings.at(-1) !== 'Definition of Done') {
    throw new Error(`#${issue.number} must have exactly one final Definition of Done`);
  }
  if (!body.trimEnd().endsWith(sharedDefinitionOfDone)) {
    throw new Error(`#${issue.number} must use the canonical Definition of Done`);
  }
  if (issue.milestone?.title !== expectedMilestone) {
    throw new Error(`#${issue.number} must use milestone ${expectedMilestone}`);
  }
  return { id, epic };
};

export const createFeatureList = (issues, generatedAt = new Date().toISOString()) => {
  const features = issues
    .filter((issue) => !issue.pull_request)
    .map((issue) => {
      const labels = issue.labels.map((label) => label.name).sort();
      const identity = validateIssue(issue, labels);
      if (!identity) return null;
      return {
        id: identity.id,
        title: issue.title.replace(/^\[MVP-\d{3}\]\s*/, ''),
        status: status(issue, labels),
        priority: oneLabel(labels, 'priority:', issue),
        epic: identity.epic,
        milestone: issue.milestone.title,
        type: oneLabel(labels, 'type:', issue),
        labels,
        dependencies: dependencies(issue.body ?? ''),
        issue: { number: issue.number, url: issue.html_url },
      };
    })
    .filter(Boolean)
    .sort((left, right) => left.issue.number - right.issue.number);

  return {
    version: 3,
    generated: true,
    generatedAt,
    sourceOfTruth: `GitHub Issues: ${repository}`,
    features,
  };
};

const comparable = ({ generatedAt: _generatedAt, ...featureList }) => featureList;

const main = () => {
  const raw = publicMode
    ? execFileSync('curl', ['-L', '--fail', '--silent', `https://api.github.com/repos/${repository}/issues?state=all&per_page=100`], { encoding: 'utf8' })
    : execFileSync('gh', ['api', `repos/${repository}/issues?state=all&per_page=100`], { encoding: 'utf8' });
  const output = createFeatureList(JSON.parse(raw));
  if (checkMode) {
    const local = JSON.parse(fs.readFileSync(featureListPath, 'utf8'));
    if (JSON.stringify(comparable(local)) !== JSON.stringify(comparable(output))) {
      throw new Error('feature_list.json is out of sync with GitHub Issues; run node scripts/sync-features.mjs');
    }
    console.log(`OK: ${output.features.length} features match GitHub Issues`);
    return;
  }
  fs.writeFileSync(featureListPath, `${JSON.stringify(output, null, 2)}\n`);
  console.log(`OK: generated ${output.features.length} features from GitHub Issues`);
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
