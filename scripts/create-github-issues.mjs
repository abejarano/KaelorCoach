import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const repo = process.argv[2] || 'abejarano/KaelorCoach';
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'issues', 'manifest.json'), 'utf8'));
const labels = JSON.parse(fs.readFileSync(path.join(root, 'issues', 'labels.json'), 'utf8'));
const featurePath = path.join(root, 'feature_list.json');
const featureList = JSON.parse(fs.readFileSync(featurePath, 'utf8'));

const gh = (args, input) => {
  return execFileSync('gh', args, {
    cwd: root,
    encoding: 'utf8',
    input: input === undefined ? undefined : JSON.stringify(input),
    stdio: ['pipe', 'pipe', 'pipe'],
  }).trim();
};

const encode = (value) => encodeURIComponent(value).replace(/%2F/g, '/');

console.log(`Repository: ${repo}`);
gh(['auth', 'status']);

for (const label of labels) {
  try {
    gh(['api', `repos/${repo}/labels/${encodeURIComponent(label.name)}`]);
    gh(['api', '-X', 'PATCH', `repos/${repo}/labels/${encodeURIComponent(label.name)}`, '--input', '-'], {
      new_name: label.name,
      color: label.color,
      description: label.description,
    });
    console.log(`label updated: ${label.name}`);
  } catch {
    gh(['api', '-X', 'POST', `repos/${repo}/labels`, '--input', '-'], label);
    console.log(`label created: ${label.name}`);
  }
}

const existingRaw = gh(['api', `repos/${repo}/issues?state=all&per_page=100`]);
const existing = JSON.parse(existingRaw).filter((issue) => !issue.pull_request);
const byFeatureId = new Map();
for (const issue of existing) {
  const match = typeof issue.body === 'string' ? issue.body.match(/<!-- feature-id:([^ ]+) -->/) : null;
  if (match) byFeatureId.set(match[1], issue);
}

for (const item of manifest.issues) {
  const bodyPath = path.join(root, item.bodyFile);
  const body = fs.readFileSync(bodyPath, 'utf8');
  let issue = byFeatureId.get(item.id);

  if (!issue) {
    const payload = {
      title: item.title,
      body,
      labels: item.labels,
      assignees: item.assignees,
    };
    issue = JSON.parse(gh(['api', '-X', 'POST', `repos/${repo}/issues`, '--input', '-'], payload));
    console.log(`issue created: #${issue.number} ${item.id}`);
  } else {
    const payload = {
      title: item.title,
      body,
      labels: item.labels,
      assignees: item.assignees,
    };
    issue = JSON.parse(gh(['api', '-X', 'PATCH', `repos/${repo}/issues/${issue.number}`, '--input', '-'], payload));
    console.log(`issue updated: #${issue.number} ${item.id}`);
  }

  const feature = featureList.features.find((candidate) => candidate.id === item.id);
  if (!feature) throw new Error(`Feature ${item.id} not found in feature_list.json`);
  feature.issue = {
    created: true,
    number: issue.number,
    url: issue.html_url,
  };
}

fs.writeFileSync(featurePath, `${JSON.stringify(featureList, null, 2)}\n`, 'utf8');
console.log('feature_list.json updated with GitHub issue numbers and URLs');
