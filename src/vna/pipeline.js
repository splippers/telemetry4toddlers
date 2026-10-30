/**
 * Glue: scanned devices + probe results -> Asset / Observation / optional Finding.
 * One device failing to normalise never takes the others (or the dashboard) down.
 */
import { toAsset } from "./asset.js";
import { toIcmpObservation } from "./observation.js";
import { evaluateIcmpObservation } from "./evaluate.js";
import { validateAsset, validateObservation, validateFinding } from "./validate.js";

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
  return { scanId: ctx.scanId, assets, observations, findings, errors };
}
