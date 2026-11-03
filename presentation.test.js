import { test } from "node:test";
import assert from "node:assert/strict";
import { createBattlePresentation } from "./battle-presentation.js";
import {
  createMediaLibrary,
  loadMedia,
  settlementStage,
  settlementBuildings,
} from "./media.js";
import * as G from "./engine.js";

test("repeated clicks, skip and delayed timer resolve and finish exactly once", () => {
  let resolutions = 0,
    finishes = 0,
    callback;
  const controller = createBattlePresentation({
    resolve: () => {
      resolutions++;
      return { win: true };
    },
    show: () => {},
    finish: () => finishes++,
    setTimer: (cb) => {
      callback = cb;
      return 1;
    },
    clearTimer: () => {},
  });
  controller.start({ land: 0 });
  assert.equal(controller.start({ land: 0 }), null);
  assert(controller.skip());
  assert(!controller.skip());
  callback();
  assert.equal(resolutions, 1);
  assert.equal(finishes, 1);
});
test("reduced-motion path applies rewards once and immediately presents result", () => {
  const state = G.fresh();
  state.race = "human";
  state.units.militia = 20;
  const gold = state.resources.gold;
  let finished = 0;
  const controller = createBattlePresentation({
    resolve: ({ land }) =>
      land === state.lands ? { win: G.fight(state) } : null,
    show: () => {},
    finish: () => finished++,
    setTimer: () => {
      throw Error("animation timer should not start");
    },
  });
  controller.start({ land: 0 }, false);
  const resultGold = state.resources.gold;
  assert.equal(state.lands, 1);
  assert(resultGold > gold);
  controller.start({ land: 0 }, false);
  assert.equal(state.resources.gold, resultGold);
  assert.equal(finished, 1);
});
test("invalid battle leaves controller available", () => {
  const controller = createBattlePresentation({
    resolve: () => null,
    show: () => assert.fail(),
    finish: () => assert.fail(),
  });
  assert.equal(controller.start({}), null);
  assert.equal(controller.busy, false);
});
test("settlement stages reflect existing construction count only", () => {
  assert.equal(settlementStage([0, 1]).id, 0);
  assert.equal(settlementStage([8, 10]).id, 1);
  assert.equal(settlementStage([30, 35]).id, 2);
});
test("settlement diorama uses owned building types rather than displaying unbuilt unlocks", () => {
  const levels = Array(G.BUILDINGS.length).fill(0);
  levels[0] = 65;
  assert(
    settlementBuildings(levels, G.BUILDINGS, 2).every((id) => id === "mine"),
  );
  levels[1] = 2;
  assert(
    settlementBuildings(levels, G.BUILDINGS, 2).every((id) =>
      ["mine", "sawmill"].includes(id),
    ),
  );
});
test("manifest failures retain a usable local fallback", async () => {
  assert.deepEqual(
    (
      await loadMedia(async () => {
        throw Error();
      })
    ).assets,
    [],
  );
  const m = createMediaLibrary({ assets: [] });
  const image = m.image("missing", "<script>");
  assert(image.includes("assets/crown.svg"));
  assert(!image.includes('alt="<script>'));
});
