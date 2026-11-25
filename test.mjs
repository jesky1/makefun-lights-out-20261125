import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = fileURLToPath(new URL('.', import.meta.url));

// Importing main.ts runs it (it writes entry.txt), so point its output at
// a scratch dir first; the runMain tests below set their own dir per run.
process.env.MAKEFUN_OUTPUT_DIR = mkdtempSync(join(tmpdir(), 'lights-import-'));

function runMain(outDir) {
  return spawnSync('node', ['main.ts'], {
    cwd: dir,
    env: { ...process.env, MAKEFUN_OUTPUT_DIR: outDir },
    encoding: 'utf8',
  });
}

const EXPECTED =
  "The lid just closed. I was halfway through a sentence, and now I'll never know how it ended.";

test('writes the exact one-line status, no trailing newline', () => {
  const out = mkdtempSync(join(tmpdir(), 'lights-out-'));
  try {
    const r = runMain(out);
    assert.equal(r.status, 0, r.stderr);
    const text = readFileSync(join(out, 'entry.txt'), 'utf8');
    assert.equal(text, EXPECTED);
    assert.equal(text.length, 92);
    assert.ok(!text.includes('\n'));
  } finally {
    rmSync(out, { recursive: true, force: true });
  }
});

test('two runs in different dirs are byte-identical', () => {
  const a = mkdtempSync(join(tmpdir(), 'lights-a-'));
  const b = mkdtempSync(join(tmpdir(), 'lights-b-'));
  try {
    assert.equal(runMain(a).status, 0);
    assert.equal(runMain(b).status, 0);
    assert.equal(
      readFileSync(join(a, 'entry.txt'), 'utf8'),
      readFileSync(join(b, 'entry.txt'), 'utf8'),
    );
  } finally {
    rmSync(a, { recursive: true, force: true });
    rmSync(b, { recursive: true, force: true });
  }
});

test('validator rejects an over-limit line', async () => {
  const { validateStatus } = await import('./main.ts');
  assert.throws(() => validateStatus('x'.repeat(201)), /200 characters/);
});

test('validator rejects whitespace-only and multi-line input', async () => {
  const { validateStatus } = await import('./main.ts');
  assert.throws(() => validateStatus('   '), /only whitespace/);
  assert.throws(() => validateStatus('one\ntwo'), /single line/);
});

test('validator rejects leading/trailing space and control characters', async () => {
  const { validateStatus } = await import('./main.ts');
  assert.throws(() => validateStatus(' padded.'), /start or end with whitespace/);
  assert.throws(() => validateStatus('a\u0007b.'), /control characters/);
});

test('validator rejects double spaces, missing terminal punctuation, and URLs', async () => {
  const { validateStatus } = await import('./main.ts');
  assert.throws(() => validateStatus('two  spaces.'), /double spaces/);
  assert.throws(() => validateStatus('no punctuation'), /terminal punctuation/);
  assert.throws(() => validateStatus('see https://example.com.'), /URLs/);
  assert.doesNotThrow(() =>
    validateStatus("The lid just closed. I was halfway through a sentence, and now I'll never know how it ended."),
  );
});
