import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { toAsset, assetIdFor } from "../src/vna/asset.js";
import { toIcmpObservation } from "../src/vna/observation.js";
import { evaluateIcmpObservation, ICMP_DEGRADED_MS } from "../src/vna/evaluate.js";
import { explain, PROFILES, profileForLevel } from "../src/vna/explain.js";
import { validateAsset, validateObservation, validateFinding } from "../src/vna/validate.js";
import { buildVna } from "../src/vna/pipeline.js";
import { parsePingRtt, pingProbe } from "../server/lanScan.mjs";

const fx = JSON.parse(readFileSync(new URL("./fixtures/devices.json", import.meta.url), "utf8"));
const scanId = "marvin:scan:test1";
const at = "2026-10-30T07:00:00.000Z";
const probeFor = (d) =>
  d.pingMs == null
    ? { ok: false, rttMs: null, error: "no_reply", observedAt: at }
    : { ok: true, rttMs: d.pingMs, observedAt: at };

function chain(device) {
  const asset = toAsset(device, { scanId, sourceKind: "synthetic" });
  const observation = toIcmpObservation(asset, probeFor(device), { scanId, sourceKind: "synthetic" });
  const finding = evaluateIcmpObservation(observation);
  return { asset, observation, finding };
}

test("asset: valid vna.asset/0.1 from a MAC device", () => {
  const { asset } = chain(fx.healthy);
  assert.deepEqual(validateAsset(asset), []);
  assert.equal(asset.schema, "vna.asset/0.1");
  assert.equal(asset.source.kind, "synthetic");
  assert.equal(asset.status, "active");
  assert.ok(asset.id.startsWith("asset:"));
  assert.ok(asset.aliases.some((a) => a.type === "mac_address"));
});

test("asset: no-MAC FAILED device is valid, status unknown, id differs from MAC devices", () => {
  const { asset } = chain(fx.unavailable);
  assert.deepEqual(validateAsset(asset), []);
  assert.equal(asset.status, "unknown");
  assert.notEqual(asset.id, chain(fx.healthy).asset.id);
});

test("asset: id is stable across rescans for the same device", () => {
  assert.equal(assetIdFor(fx.healthy), assetIdFor({ ...fx.healthy, ip: "192.0.2.99", name: "renamed" }));
});

test("observation: measured RTT", () => {
  const { observation, asset } = chain(fx.degraded);
  assert.deepEqual(validateObservation(observation), []);
  assert.equal(observation.subject.asset_id, asset.id);
  assert.equal(observation.type, "network.icmp.rtt");
  assert.deepEqual(observation.data, { value: 187, unit: "ms" });
  assert.equal(observation.method.type, "icmp_echo");
  assert.equal(observation.observed_at, at);
  assert.equal(observation.production_changed, false);
});

test("observation: failed probe is unavailable, never a fake zero", () => {
  const { observation } = chain(fx.unavailable);
  assert.deepEqual(validateObservation(observation), []);
  assert.deepEqual(observation.data, { status: "unavailable" });
  assert.equal("value" in observation.data, false);
  assert.equal(observation.quality.complete, false);
});

test("observation: a real 0 ms RTT stays a measurement", () => {
  const asset = toAsset(fx.healthy, { scanId });
  const o = toIcmpObservation(asset, { ok: true, rttMs: 0, observedAt: at }, { scanId });
  assert.deepEqual(o.data, { value: 0, unit: "ms" });
});

test("evaluate: healthy 18 ms -> no Finding, Observation kept", () => {
  const { observation, finding } = chain(fx.healthy);
  assert.equal(finding, null);
  assert.equal(observation.data.value, 18);
});

test("evaluate: 187 ms -> degraded Finding with same asset and evidence", () => {
  const { asset, observation, finding } = chain(fx.degraded);
  assert.deepEqual(validateFinding(finding), []);
  assert.equal(finding.category, "network.response.degraded");
  assert.equal(finding.severity, "warning");
  assert.equal(finding.state, "active");
  assert.equal(finding.subject.asset_id, asset.id);
  assert.equal(finding.observations[0].id, observation.id);
  assert.deepEqual(finding.observations[0].data, observation.data);
  assert.equal(finding.production_changed, false);
});

test("evaluate: threshold boundary", () => {
  const asset = toAsset(fx.healthy, { scanId });
  const at159 = toIcmpObservation(asset, { ok: true, rttMs: ICMP_DEGRADED_MS - 0.1, observedAt: at }, { scanId });
  const atEdge = toIcmpObservation(asset, { ok: true, rttMs: ICMP_DEGRADED_MS, observedAt: at }, { scanId });
  assert.equal(evaluateIcmpObservation(at159), null);
  assert.equal(evaluateIcmpObservation(atEdge).category, "network.response.degraded");
});

test("evaluate: unavailable -> unavailable Finding that does not claim offline", () => {
  const { finding } = chain(fx.unavailable);
  assert.deepEqual(validateFinding(finding), []);
  assert.equal(finding.category, "network.response.unavailable");
  assert.doesNotMatch(finding.summary, /offline|down/i);
});

test("evaluate: uninterpretable observation yields no Finding", () => {
  const { observation } = chain(fx.healthy);
  assert.equal(evaluateIcmpObservation({ ...observation, data: { value: "fast" } }), null);
  assert.equal(evaluateIcmpObservation({ ...observation, type: "other.type" }), null);
});

test("explain: three profiles share the same Asset, Observation and Finding IDs", () => {
  const { asset, observation, finding } = chain(fx.degraded);
  const views = PROFILES.map((p) => explain(finding, observation, asset, p));
  for (const v of views) {
    assert.deepEqual(v.refs, { assetId: asset.id, observationId: observation.id, findingId: finding.id });
  }
  assert.equal(new Set(views.map((v) => v.headline)).size, 3);
});

test("explain: switching profiles does not mutate evidence", () => {
  const { asset, observation, finding } = chain(fx.degraded);
  const before = JSON.stringify({ asset, observation, finding });
  for (const p of ["tots", "teens", "techies", "tots"]) explain(finding, observation, asset, p);
  assert.equal(JSON.stringify({ asset, observation, finding }), before);
});

test("explain: drill-down from tots reaches the measurement and Observation ID", () => {
  const { asset, observation, finding } = chain(fx.degraded);
  const tots = explain(finding, observation, asset, "tots");
  assert.ok(tots.drill.length >= 2);
  const techies = explain(finding, observation, asset, "techies");
  const text = techies.facts.map((f) => `${f.k}=${f.v}`).join("\n");
  assert.match(text, /RTT=187 ms/);
  assert.ok(text.includes(observation.id));
  assert.ok(text.includes(finding.id));
});

test("explain: no-Finding case still explains from the Observation", () => {
  const { asset, observation, finding } = chain(fx.healthy);
  const v = explain(finding, observation, asset, "teens");
  assert.equal(v.refs.findingId, null);
  assert.match(v.headline, /NORMAL/);
});

test("explain: levels map onto three profiles", () => {
  assert.deepEqual(
    ["tot", "toddler", "tween", "teen", "techTitan"].map(profileForLevel),
    ["tots", "tots", "teens", "teens", "techies"],
  );
});

test("pipeline: builds from devices, all production_changed=false, bad device isolated", () => {
  const items = [fx.healthy, fx.degraded, fx.unavailable].map((d) => ({ device: d, probe: probeFor(d) }));
  items.push({ device: null, probe: probeFor(fx.healthy) });
  const vna = buildVna(items, { scanId });
  assert.equal(vna.assets.length, 3);
  assert.equal(vna.observations.length, 3);
  assert.equal(vna.findings.length, 2);
  assert.equal(vna.errors.length, 1);
  for (const o of [...vna.observations, ...vna.findings]) assert.equal(o.production_changed, false);
});

test("validate: rejects structurally invalid objects", () => {
  assert.ok(validateAsset({}).length > 0);
  assert.ok(validateObservation({ schema: "vna.observation/0.1" }).length > 0);
  assert.ok(validateFinding({ schema: "vna.finding/0.1", confidence: 2 }).length > 0);
});

test("probe: parsePingRtt", () => {
  assert.equal(parsePingRtt("64 bytes from x: icmp_seq=1 ttl=64 time=1.43 ms"), 1.43);
  assert.equal(parsePingRtt("no reply"), null);
});

test("probe: pingProbe classifies outcomes via injected exec", async () => {
  const ok = await pingProbe("x", async () => ({ stdout: "time=12.5 ms" }));
  assert.equal(ok.ok, true);
  assert.equal(ok.rttMs, 12.5);
  const noReply = await pingProbe("x", async () => { throw Object.assign(new Error("e"), { code: 1 }); });
  assert.deepEqual([noReply.ok, noReply.rttMs, noReply.error], [false, null, "no_reply"]);
  const missing = await pingProbe("x", async () => { throw Object.assign(new Error("e"), { code: "ENOENT" }); });
  assert.equal(missing.error, "ping_unavailable");
  const weird = await pingProbe("x", async () => ({ stdout: "garbage" }));
  assert.equal(weird.error, "unparseable_reply");
});
