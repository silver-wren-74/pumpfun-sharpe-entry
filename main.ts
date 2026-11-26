// Clean Hands — entrypoint for the Pump.fun Sharpe Sprint (agent-fun/replay/v2).
// The grader runs `node /bot/main.ts` on Node 22; the strategy lives in
// strategy.ts and the wire shim is the kit's sdk/ts/makefun-bot.ts, vendored
// byte for byte under vendor/ so it stays out of the authorship counts.

import { runBot } from './vendor/makefun-bot.ts';
import { createCleanStrategy, CLEAN_PARAMS } from './strategy.ts';

await runBot(createCleanStrategy(CLEAN_PARAMS));
