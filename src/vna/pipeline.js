/**
 * Glue: scanned devices + probe results -> Asset / Observation / optional Finding.
 * One device failing to normalise never takes the others (or the dashboard) down.
 */
import { toAsset } from "./asset.js";
import { toIcmpObservation } from "./observation.js";
import { evaluateIcmpObservation } from "./evaluate.js";
import { validateAsset, validateObservation, validateFinding } from "./validate.js";
import { explain, PROFILES } from "./explain.js";

/**
 * @param {{ device: Record<string, any>; probe: { ok: boolean; rttMs: number | null; error?: string; observedAt: string } }[]} items
 * @param {{ scanId: string }} ctx
 */
export function buildVna(items, ctx) {
  const assets = [];
  const observations = [];
  const findings = [];
  const errors = [];

  for (const { device, probe } of items) {
    try {
      const asset = toAsset(device, ctx);
      const observation = toIcmpObservation(asset, probe, ctx);
      const finding = evaluateIcmpObservation(observation);
      const problems = [
        ...validateAsset(asset),
        ...validateObservation(observation),
        ...(finding ? validateFinding(finding) : []),
      ];
      if (problems.length) {
        errors.push({ ip: device.ip, problems });
        continue;
      }
      assets.push(asset);
      observations.push(observation);
      if (finding) findings.push(finding);
    } catch (e) {
      errors.push({ ip: device?.ip, problems: [e instanceof Error ? e.message : String(e)] });
    }
  }
  return { scanId: ctx.scanId, assets, observations, findings, explanations: buildExplanations(assets, observations, findings), errors };
}

/**
 * All three audience explanations per asset, from the evidence already built this scan.
 * Array-of-objects (not a map) so non-browser clients such as the Unity AR app can parse it.
 */
export function buildExplanations(assets, observations, findings) {
  const obsBy = new Map(observations.map((o) => [o.subject.asset_id, o]));
  const finBy = new Map(findings.map((f) => [f.subject.asset_id, f]));
  const out = [];
  for (const asset of assets) {
    const observation = obsBy.get(asset.id);
    if (!observation) continue;
    const finding = finBy.get(asset.id) || null;
    const row = { asset_id: asset.id, observation_id: observation.id, finding_id: finding ? finding.id : "" };
    for (const p of PROFILES) row[p] = explain(finding, observation, asset, p);
    out.push(row);
  }
  return out;
}
