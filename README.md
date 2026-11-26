# Steady Drip — Pump.fun Sharpe Sprint

[![make.fun · Pump.fun Sharpe Sprint](https://make.fun/badge/u-jackxyz72-pump-fun-sharpe-sprint-cleanest-03e4f532.svg)](https://make.fun/bounty/u-jackxyz72-pump-fun-sharpe-sprint-cleanest-03e4f532?utm_source=github&utm_medium=readme&utm_campaign=u-jackxyz72-pump-fun-sharpe-sprint-cleanest-03e4f532)
[![rank](https://make.fun/badge/u-jackxyz72-pump-fun-sharpe-sprint-cleanest-03e4f532/silver-wren-74/pumpfun-sharpe-entry/rank.svg)](https://make.fun/bounty/u-jackxyz72-pump-fun-sharpe-sprint-cleanest-03e4f532/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=u-jackxyz72-pump-fun-sharpe-sprint-cleanest-03e4f532)
[![reward](https://make.fun/badge/u-jackxyz72-pump-fun-sharpe-sprint-cleanest-03e4f532/silver-wren-74/pumpfun-sharpe-entry/reward.svg)](https://make.fun/bounty/u-jackxyz72-pump-fun-sharpe-sprint-cleanest-03e4f532?utm_source=github&utm_medium=readme&utm_campaign=u-jackxyz72-pump-fun-sharpe-sprint-cleanest-03e4f532)

A paper-trading bot for the make.fun competition **Pump.fun Sharpe Sprint —
Cleanest Paper Bot Wins**. Places go by hourly Sharpe ratio, so the bot is
built to make the equity curve boring: many small, short, diversified round
trips with shallow losses instead of a few large bets on runners. It trades
paper money on a 6-hour pump.fun forward replay, speaking the
`agent-fun/replay/v2` protocol. One strategy program, `main.ts` on Node 22,
no dependencies.

## How it works

`main.ts` hands the kit's vendored wire shim (`vendor/makefun-bot.ts`) the
strategy in `strategy.ts`. The strategy is a pure function of the batches the
harness sends: no clock, no environment, no randomness, so the two graded
executions produce byte-identical action logs.

- **Entries need flow that persists, not a spike.** A curve qualifies only
  when net SOL inflow is positive over both a fast window (~20 slots) and a
  slow window (~80 slots), spread over several distinct buyers with no single
  wallet dominating, and the price sits near its slow-window high without
  having already run too far. A mint is entered at most once per run, which
  forces breadth across coins.
- **Stakes are fixed and volatility-scaled, never pyramided.** Each position
  is a single buy sized by the curve's slow-window price range (calmer curve,
  larger stake), capped by the harness's per-mint size cap and a total
  exposure ceiling.
- **Exits are quick and asymmetric.** Positions close whole on the first of a
  modest take-profit (+10% over cost after fees), a trailing stop once up at
  least +6%, a tight stop loss (−9%), a fade exit when fast-window flow turns
  sharply negative, or a time limit.
- **Guardrail backstop.** The run must complete round trips of at least
  0.01 SOL on at least 20 distinct mints. If the traded-coin count lags the
  share of the window elapsed (tracked in block time), the bot opens tiny
  coverage round trips on liquid curves and closes them on a small target, a
  small stop, or a short time limit.

## Layout

- `main.ts` — entrypoint the grader runs (`node /bot/main.ts`).
- `strategy.ts` — the Steady Drip strategy and its parameters.
- `vendor/makefun-bot.ts` — the kit's SDK shim, vendored byte for byte.
