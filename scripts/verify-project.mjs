import fs from 'node:fs';
import path from 'node:path';
import { requiredIssueHeadings } from './project-config.mjs';

const root = process.cwd();
const fail = (message) => {
  console.error(`ERROR: ${message}`);
  process.exitCode = 1;
};
const required = [
  'README.md', 'ROADMAP.md', 'PROJECT_AUDIT.md', 'AGENTS.md', 'CODEX.md',
  'docs/ARCHITECTURE.md', 'docs/PRODUCT.md', 'docs/ISSUE_STANDARD.md',
  '.github/ISSUE_TEMPLATE/feature.md', '.codex/agents/leader.md',
  '.codex/agents/planner.md', '.codex/agents/implementer.md',
  '.codex/agents/reviewer.md', '.codex/agents/qa.md', '.codex/agents/product-owner.md',
];
for (const file of required) if (!fs.existsSync(path.join(root, file))) fail(`missing ${file}`);

const featurePath = path.join(root, 'feature_list.json');
if (!fs.existsSync(featurePath)) fail('missing feature_list.json');
const featureList = JSON.parse(fs.readFileSync(featurePath, 'utf8'));
if (featureList.version !== 3 || featureList.generated !== true) fail('feature_list.json must be generated version 3');
const ids = new Set(featureList.features.map((feature) => feature.id));
const byId = new Map(featureList.features.map((feature) => [feature.id, feature]));
let active = 0;
for (const feature of featureList.features) {
  for (const field of ['id', 'title', 'status', 'priority', 'epic', 'type', 'labels', 'dependencies', 'issue']) {
    if (!(field in feature)) fail(`${feature.id ?? 'unknown'} missing ${field}`);
  }
  if (!Number.isInteger(feature.issue?.number) || !String(feature.issue?.url).startsWith('https://github.com/')) fail(`${feature.id} has invalid issue link`);
  if (feature.status === 'inprogress') active += 1;
  for (const dependency of feature.dependencies) if (!ids.has(dependency)) fail(`${feature.id} depends on unknown ${dependency}`);
}
if (active > 1) fail(`more than one in-progress feature (${active})`);

const visiting = new Set();
const visited = new Set();
const visit = (id) => {
  if (visited.has(id) || process.exitCode) return;
  if (visiting.has(id)) {
    fail(`cyclic feature dependency at ${id}`);
    return;
  }
  visiting.add(id);
  for (const dependency of byId.get(id).dependencies) visit(dependency);
  visiting.delete(id);
  visited.add(id);
};
for (const id of ids) visit(id);

const template = fs.readFileSync(path.join(root, '.github/ISSUE_TEMPLATE/feature.md'), 'utf8');
for (const heading of requiredIssueHeadings) if (!template.includes(`## ${heading}`)) fail(`issue template missing heading ${heading}`);

for (const skill of fs.readdirSync(path.join(root, '.agents/skills'))) {
  const file = path.join(root, '.agents/skills', skill, 'SKILL.md');
  if (!fs.existsSync(file)) fail(`skill ${skill} missing SKILL.md`);
  const content = fs.readFileSync(file, 'utf8');
  if (!content.startsWith('---\n') || !/^name: [a-z0-9-]+$/m.test(content)) fail(`skill ${skill} has invalid front matter`);
}

if (!process.exitCode) console.log(`OK: ${featureList.features.length} generated features and project governance are valid`);
