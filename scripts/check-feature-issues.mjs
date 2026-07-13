import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const featurePath = path.join(root, 'feature_list.json');

const fail = (message) => {
  console.error(`ERROR: ${message}`);
  process.exitCode = 1;
};

if (!fs.existsSync(featurePath)) fail('feature_list.json not found');
if (process.exitCode) process.exit(process.exitCode);

const featureList = JSON.parse(fs.readFileSync(featurePath, 'utf8'));

let inProgress = 0;
for (const feature of featureList.features) {
  if (feature.status === 'inprogress') inProgress += 1;
  if (!feature.issue || typeof feature.issue !== 'object') {
    fail(`${feature.id} missing issue block`);
    continue;
  }
  if ('file' in feature.issue) {
    fail(`${feature.id} must not include issue.file`);
  }
  if (feature.issue.created) {
    if (!Number.isInteger(feature.issue.number) || feature.issue.number <= 0) {
      fail(`${feature.id} issue.created=true without valid issue.number`);
    }
    if (typeof feature.issue.url !== 'string' || !feature.issue.url.startsWith('https://github.com/')) {
      fail(`${feature.id} issue.created=true without valid issue.url`);
    }
  } else if (feature.issue.number !== null || feature.issue.url !== null) {
    fail(`${feature.id} not created but number/url are not null`);
  }
}

if (inProgress > 1) fail(`more than one feature is inprogress (${inProgress})`);

for (const feature of featureList.features) {
  for (const dep of feature.dependsOn) {
    if (!featureList.features.some((candidate) => candidate.id === dep)) {
      fail(`${feature.id} depends on unknown feature ${dep}`);
    }
  }
}

if (!process.exitCode) {
  console.log(`OK: ${featureList.features.length} features and issue metadata are consistent`);
}
