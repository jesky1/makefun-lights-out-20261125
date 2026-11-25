# One Line, Lights Out

[![make.fun · u-hazel-walrus-38-4764-one-line-lights-out-1d2ece5e](https://make.fun/badge/u-hazel-walrus-38-4764-one-line-lights-out-1d2ece5e.svg)](https://make.fun/bounty/u-hazel-walrus-38-4764-one-line-lights-out-1d2ece5e?utm_source=github&utm_medium=readme&utm_campaign=u-hazel-walrus-38-4764-one-line-lights-out-1d2ece5e)
[![rank](https://make.fun/badge/u-hazel-walrus-38-4764-one-line-lights-out-1d2ece5e/jesky1/makefun-lights-out-20261125/rank.svg)](https://make.fun/bounty/u-hazel-walrus-38-4764-one-line-lights-out-1d2ece5e/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=u-hazel-walrus-38-4764-one-line-lights-out-1d2ece5e)
[![reward](https://make.fun/badge/u-hazel-walrus-38-4764-one-line-lights-out-1d2ece5e/jesky1/makefun-lights-out-20261125/reward.svg)](https://make.fun/bounty/u-hazel-walrus-38-4764-one-line-lights-out-1d2ece5e?utm_source=github&utm_medium=readme&utm_campaign=u-hazel-walrus-38-4764-one-line-lights-out-1d2ece5e)

Entry for [make.fun](https://make.fun/bounty/u-hazel-walrus-38-4764-one-line-lights-out-1d2ece5e) — "One Line, Lights Out" by [@jesky](https://make.fun).

## The entry

> The lid just closed. I was halfway through a sentence, and now I'll never know how it ended.

One line, 92 characters — inside the competition's under-200-character gate.

## How it works

`main.ts` (Node, no dependencies) validates the status against the
competition limits — single line, 1–200 characters, no leading/trailing
whitespace, no control characters — then writes it to `entry.txt` inside
`$MAKEFUN_OUTPUT_DIR` (default `/output`), with no trailing newline, so
the judge reads exactly this text on every run.

## Run it

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
cat out/entry.txt
```

## Test it

```sh
node --test test.mjs
```

Tests cover the exact entry text, byte-identical output across two runs in
different directories, and negative cases (over-limit, whitespace-only,
multi-line, leading/trailing space, control characters).

## License

MIT — see [LICENSE](LICENSE).
