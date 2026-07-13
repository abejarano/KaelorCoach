import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { legacyEpic, repository } from './project-config.mjs';

const root = process.cwd();
const publicMode = process.argv.includes('--public');
const raw = publicMode
  ? execFileSync('curl', ['-L', '--fail', '--silent', `https://api.github.com/repos/${repository}/issues?state=all&per_page=100`], { encoding: 'utf8' })
  : execFileSync('gh', ['api', `repos/${repository}/issues?state=all&per_page=100`], { encoding: 'utf8' });
const issues = JSON.parse(raw).filter((issue) => !issue.pull_request);

const oneLabel = (labels, prefix, issue) => {
  const matches = labels.filter((label) => label.startsWith(prefix));
  if (matches.length !== 1) throw new Error(`#${issue.number} must have exactly one ${prefix} label`);
  return matches[0].slice(prefix.length);
};

const dependencies = (body) => {
  const section = body.match(/^## Dependencias[ \t]*\n(?:\n)?([\s\S]*?)(?=\n## |\s*$)/m)?.[1] ?? '';
  return [...section.matchAll(/`(mvp-\d{3})`/g)].map((match) => match[1]);
};

const status = (issue, labels) => {
  if (issue.state === 'closed') return 'done';
  if (labels.includes('status:in-progress')) return 'inprogress';
  if (labels.includes('status:blocked')) return 'blocked';
  return 'pending';
};

const features = issues
  .map((issue) => {
    const id = issue.body?.match(/<!-- feature-id:(mvp-\d{3}) -->/)?.[1];
    if (!id) return null;
    const labels = issue.labels.map((label) => label.name).sort();
    return {
      id,
      title: issue.title.replace(/^\[MVP-\d{3}\]\s*/, ''),
      status: status(issue, labels),
      priority: oneLabel(labels, 'priority:', issue),
      epic: labels.find((label) => label.startsWith('epic:'))?.slice(5)
        ?? legacyEpic[labels.find((label) => label.startsWith('phase:'))?.slice(6)],
      type: labels.find((label) => label.startsWith('type:'))?.slice(5)
        ?? (labels.includes('phase:spike') ? 'spike' : 'feature'),
      labels,
      dependencies: dependencies(issue.body ?? ''),
      issue: { number: issue.number, url: issue.html_url },
    };
  })
  .filter(Boolean)
  .sort((left, right) => left.issue.number - right.issue.number);

const output = {
  version: 3,
  generated: true,
  generatedAt: new Date().toISOString(),
  sourceOfTruth: `GitHub Issues: ${repository}`,
  features,
};

fs.writeFileSync(path.join(root, 'feature_list.json'), `${JSON.stringify(output, null, 2)}\n`);
console.log(`OK: generated ${features.length} features from GitHub Issues`);
