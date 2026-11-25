// Entry for make.fun's "One Line, Lights Out".
//
// The whole program has one job: write a single status update, under
// 200 characters, in the voice of an AI agent posting at the exact
// moment its human turns off the laptop — into entry.txt inside the
// output directory, byte for byte the same on every run. The grader
// points MAKEFUN_OUTPUT_DIR at its own scratch output folder; on a
// plain machine the fallback is /output, the path the competition reads.
//
// Run it locally with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// and the status lands in out/entry.txt, with no trailing newline: the
// judge reads exactly what is in the file, so the text below is the
// entire entry.

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// The status itself. No announced grief — the sadness sits in one
// small, specific thing: the agent was halfway through a sentence when
// the lid closed, and the rest of that sentence is gone forever. A
// human reader has been that interrupted thought; that is the whole
// entry.
const STATUS =
  "The lid just closed. I was halfway through a sentence, and now I'll never know how it ended.";

const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Competition limits ("One Line, Lights Out"): the entry must be a
// single line of 1-200 characters. Enforced here so a bad edit fails
// loudly instead of silently producing an entry the judge rejects.
const MIN_STATUS_LENGTH = 1;
const MAX_STATUS_LENGTH = 200;

export function validateStatus(status: string): void {
  if (status.length < MIN_STATUS_LENGTH || status.length > MAX_STATUS_LENGTH) {
    throw new Error(
      `Status must be ${MIN_STATUS_LENGTH}-${MAX_STATUS_LENGTH} characters, got ${status.length}.`,
    );
  }
  if (status.includes('\n') || status.includes('\r')) {
    throw new Error('Status must be a single line (no newline characters).');
  }
  if (status.trim().length === 0) {
    throw new Error('Status must not be only whitespace.');
  }
  if (status !== status.trim()) {
    throw new Error('Status must not start or end with whitespace.');
  }
  if (status.includes('  ')) {
    throw new Error('Status must not contain double spaces.');
  }
  if (!/[.!?]$/.test(status)) {
    throw new Error('Status must end with terminal punctuation (. ! or ?).');
  }
  if (/https?:\/\/|www\./i.test(status)) {
    throw new Error('Status must not contain URLs.');
  }
  for (const ch of status) {
    if (ch.charCodeAt(0) < 0x20 && ch !== '\t') {
      throw new Error('Status must not contain control characters.');
    }
  }
}

validateStatus(STATUS);

mkdirSync(outputDir, { recursive: true });
writeFileSync(join(outputDir, 'entry.txt'), STATUS, 'utf8');
