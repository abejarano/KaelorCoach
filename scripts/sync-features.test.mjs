import assert from 'node:assert/strict';
import test from 'node:test';
import { dependencies } from './sync-features.mjs';

test('extracts dependencies separated by commas', () => {
  assert.deepEqual(dependencies('## Dependencias\n\n`mvp-001`, `mvp-002`, `mvp-003`\n\n## Alcance'), [
    'mvp-001', 'mvp-002', 'mvp-003',
  ]);
});

test('extracts dependencies from multiline bullets', () => {
  assert.deepEqual(dependencies('## Dependencias\n\n- `mvp-001`\n- `mvp-002`\n- `mvp-003`\n\n## Alcance'), [
    'mvp-001', 'mvp-002', 'mvp-003',
  ]);
});

test('extracts a single dependency', () => {
  assert.deepEqual(dependencies('## Dependencias\n\n`mvp-001`\n\n## Alcance'), ['mvp-001']);
});

test('extracts no dependencies when the section has none', () => {
  assert.deepEqual(dependencies('## Dependencias\n\nNinguna\n\n## Alcance'), []);
});

test('extracts every dependency when the section reaches EOF', () => {
  assert.deepEqual(dependencies('## Dependencias\n\n- `mvp-001`\n- `mvp-002`'), ['mvp-001', 'mvp-002']);
});
