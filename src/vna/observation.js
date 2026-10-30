/** Probe result -> vna.observation/0.1 (evidence only, no interpretation). */

const FAILURE_REASON = {
  no_reply: "No ICMP echo reply arrived within the probe timeout.",
  ping_unavailable: "The ping command could not be run on the collector.",
  unparseable_reply: "A reply arrived but no RTT could be read from it.",
  ping_error: "The ping command failed for an unclassified reason.",
};

/**
 * @param {{ id: string }} asset
 * @param {{ ok: boolean; rttMs: number | null; error?: string; observedAt: string }} probe
 * @param {{ scanId: string; sourceKind?: string }} ctx
 */
export function toIcmpObservation(asset, probe, ctx) {
  const scanShort = String(ctx.scanId).split(":").pop();
  const assetSlug = asset.id.replace(/^asset:/, "");
  const measured = probe.ok && typeof probe.rttMs === "number" && Number.isFinite(probe.rttMs);

  /** @type {Record<string, unknown>} */
  const obs = {
    schema: "vna.observation/0.1",
    id: `observation:icmp-rtt:${scanShort}:${assetSlug}`,
    producer: { id: "t4t", type: "collector" },
    source: { kind: ctx.sourceKind || "live", id: ctx.scanId },
    observed_at: probe.observedAt,
    type: "network.icmp.rtt",
    subject: { type: "asset", asset_id: asset.id },
    method: { type: "icmp_echo", count: 1, timeout_ms: 1000 },
    data: measured ? { value: probe.rttMs, unit: "ms" } : { status: "unavailable" },
    production_changed: false,
  };
  if (!measured) {
    obs.quality = {
      complete: false,
      reason: FAILURE_REASON[probe.error || "no_reply"] || FAILURE_REASON.ping_error,
    };
  }
  return obs;
}
