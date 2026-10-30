/**
 * Device row (from lanScan) -> vna.asset/0.1.
 * Pure: no Node or DOM imports, so server and browser can share it.
 */

const UNKNOWN_NEIGH = new Set(["FAILED", "INCOMPLETE"]);

/**
 * Slice 001 identity: derived from the existing device id (MAC when known,
 * else IP). Treated as opaque downstream. IP fallback is a known limitation.
 * @param {{ mac?: string; ip?: string }} device
 */
export function assetIdFor(device) {
  const mac = String(device.mac || "").replace(/[^0-9a-f]/gi, "").toLowerCase();
  if (mac) return `asset:mac-${mac}`;
  return `asset:ip-${String(device.ip || "unknown").replace(/\./g, "-")}`;
}

/**
 * @param {Record<string, any>} device
 * @param {{ scanId?: string; sourceKind?: string }} [ctx]
 */
export function toAsset(device, ctx = {}) {
  const aliases = [];
  if (device.hostname) aliases.push({ type: "hostname", value: String(device.hostname) });
  if (device.snmp?.sysName && device.snmp.sysName !== device.hostname) {
    aliases.push({ type: "hostname", value: String(device.snmp.sysName) });
  }
  if (device.mac) aliases.push({ type: "mac_address", value: String(device.mac) });

  const source = { kind: ctx.sourceKind || "live", producer: "t4t" };
  if (ctx.scanId) source.id = ctx.scanId;

  return {
    schema: "vna.asset/0.1",
    id: assetIdFor(device),
    kind: "unknown",
    name: String(device.name || device.ip || "Unknown device"),
    source,
    aliases,
    status: UNKNOWN_NEIGH.has(device.neighState) ? "unknown" : "active",
    attributes: { ip: device.ip ?? null, iface: device.iface ?? null },
  };
}
