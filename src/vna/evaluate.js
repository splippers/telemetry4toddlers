/**
 * The one explicit Slice 001 rule. Thresholds are T4T policy, not VNA contract:
 * 160 ms is the existing "help" boundary in server tierFromPing.
 */
export const ICMP_DEGRADED_MS = 160;
export const RULE_ID = "icmp-rtt-threshold";

/**
 * @param {Record<string, any>} observation vna.observation/0.1
 * @returns {Record<string, any> | null} vna.finding/0.1 or null (no Finding warranted)
 */
export function evaluateIcmpObservation(observation) {
  if (observation?.type !== "network.icmp.rtt") return null;
  const data = observation.data || {};
  const hasValue = typeof data.value === "number" && Number.isFinite(data.value);

  let category;
  let summary;
  if (data.status === "unavailable") {
    category = "network.response.unavailable";
    summary = "No network response was received from this device.";
  } else if (hasValue && data.value >= ICMP_DEGRADED_MS) {
    category = "network.response.degraded";
    summary = `Network response is slower than the expected range (${ICMP_DEGRADED_MS} ms).`;
  } else {
    return null; // normal, or not interpretable: unknown stays unknown
  }

  const assetId = observation.subject.asset_id;
  return {
    schema: "vna.finding/0.1",
    id: `finding:${category}:${assetId.replace(/^asset:/, "")}`,
    producer: { id: "t4t", type: "application" },
    source: { ...observation.source },
    observed_at: observation.observed_at,
    category,
    severity: "warning",
    state: "active",
    subject: { type: "asset", asset_id: assetId },
    summary,
    observations: [
      {
        id: observation.id,
        type: observation.type,
        observed_at: observation.observed_at,
        data: { ...data },
      },
    ],
    evidence: [
      {
        type: "t4t.rule",
        rule: RULE_ID,
        threshold_ms: ICMP_DEGRADED_MS,
        description: "ICMP RTT at or above the threshold, or no reply received.",
      },
    ],
    production_changed: false,
  };
}
