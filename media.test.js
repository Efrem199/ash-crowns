import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile, stat, readdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import * as G from "./engine.js";
const base = new URL("./", import.meta.url);
const manifest = JSON.parse(
  await readFile(new URL("assets/manifest.json", base), "utf8"),
);
test("every hero, building, unit, technology, relic and audio event has a real licensed asset", async () => {
  const required = [
    ...G.HEROES.map((x) => "hero-" + x.id),
    ...G.BUILDINGS.map((x) => "building-" + x.id),
    ...G.UNITS.map((x) => "unit-" + x.id),
    ...G.TECHS.map((x) => "tech-" + x.id),
    ...G.RELICS.map((x) => "relic-" + x.id),
    ...[0, 1, 2, 3].map((x) => "region-" + x),
    "ui-frame",
    "ui-button",
    ...["settlement", "campaign", "boss", "legacy"].map((x) => "music-" + x),
    ...[
      "click",
      "crit",
      "build",
      "recruit",
      "research",
      "policy",
      "attack",
      "hit",
      "magic",
      "victory",
      "defeat",
      "quest",
      "achievement",
      "expedition",
      "hero",
      "talent",
      "relic",
      "prestige",
    ].map((x) => "sfx-" + x),
  ];
  const ids = manifest.assets.map((x) => x.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const id of required) {
    const asset = manifest.assets.find((x) => x.id === id);
    assert(asset, id);
    assert.match(asset.sourceUrl, /^https:\/\//);
    assert(asset.author && asset.license && asset.processing, id);
    for (const p of [asset.path, asset.originalPath, asset.licensePath]) {
      assert(p && !p.includes(".."), id + " source path");
      assert((await stat(new URL(p, base))).isFile(), p);
    }
  }
});
test("all manifest checksums and image/audio metadata agree with shipped files", async () => {
  for (const a of manifest.assets) {
    const buffer = await readFile(new URL(a.path, base));
    assert.equal(
      createHash("sha256").update(buffer).digest("hex"),
      a.sha256,
      a.id,
    );
    if (a.kind === "image") assert(a.width > 0 && a.height > 0, a.id);
    if (a.kind === "music" || a.kind === "sound") assert(a.duration > 0, a.id);
    if (a.path.endsWith(".webp")) {
      assert.equal(buffer.toString("ascii", 0, 4), "RIFF");
      assert.equal(buffer.toString("ascii", 8, 12), "WEBP");
    }
  }
});
async function files(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const u = new URL(e.name + (e.isDirectory() ? "/" : ""), dir);
    if (e.isDirectory()) out.push(...(await files(u)));
    else out.push(u);
  }
  return out;
}
test("all tracked materials are under 100 MB and even all images plus application code fit the 3 MB startup ceiling", async () => {
  const dirs = ["assets/", "asset-sources/", "licenses/"];
  let all = 0;
  for (const d of dirs)
    for (const p of await files(new URL(d, base))) all += (await stat(p)).size;
  assert(all <= 100 * 1024 * 1024, all + " media bytes");
  const uniqueImages = [
    ...new Set(
      manifest.assets.filter((x) => x.kind === "image").map((x) => x.path),
    ),
  ];
  let startup = 0;
  for (const p of uniqueImages) startup += (await stat(new URL(p, base))).size;
  for (const p of await files(base)) {
    const name = fileURLToPath(p);
    if (
      !name.includes("asset-sources") &&
      !name.includes("licenses") &&
      !name.includes("assets") &&
      /\.(js|css|html)$/.test(name)
    )
      startup += (await stat(p)).size;
  }
  startup += (await stat(new URL("assets/manifest.json", base))).size;
  assert(startup <= 3 * 1024 * 1024, startup + " startup ceiling bytes");
});
