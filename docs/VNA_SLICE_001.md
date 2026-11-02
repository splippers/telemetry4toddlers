# VNA Slice 001 in T4T

T4T now speaks the VNA v0.1 contracts for one flow: **one ICMP ping, one Finding, three explanations**. Contracts and the slice spec live in the VNA repo (`docs/contracts/`, `docs/SLICE_01.md`). T4T does not copy their semantics; it only implements the checks it needs.

```text
ip neigh / ping / DNS / SNMP   (server/lanScan.mjs, unchanged collection)
        ↓
device row  ──►  toAsset          vna.asset/0.1          src/vna/asset.js
        ↓
pingProbe   ──►  toIcmpObservation vna.observation/0.1   src/vna/observation.js
        ↓
evaluateIcmpObservation  (the one rule)                  src/vna/evaluate.js
        ↓
optional vna.finding/0.1
        ↓
explain(finding, observation, asset, profile)            src/vna/explain.js
        ↓
tots / teens / techies   (card panel in src/main.js)
```

## Where things are

| Piece | File |
|---|---|
| Probe (reason + timestamp kept) | `pingProbe`, `server/lanScan.mjs` |
| Asset / Observation / Finding | `src/vna/asset.js`, `observation.js`, `evaluate.js` |
| Wording per audience | `src/vna/explain.js` |
| Contract checks (from each contract's Validation Rules) | `src/vna/validate.js` |
| Glue, per-device error isolation | `src/vna/pipeline.js` |
| Card panel + cached re-render | `t4Explain`, `paintScan`, `src/main.js` |
| Tests and synthetic fixtures | `test/` (`npm test`) |

`src/vna/` is pure ESM with no Node or DOM imports, so the server and the browser bundle share it.

## `/api/devices` additions

Device rows are unchanged. The response gains one top-level key:

```text
vna: { scanId, assets[], observations[], findings[], errors[] }
```

`errors` lists devices that failed to normalise or validate; they are skipped and the rest of the dashboard is unaffected. If `vna` is missing, cards render exactly as before.

## Decisions (existing code wins over the spec)

- **The one rule** (`evaluate.js`): RTT of 160 ms or more gives `network.response.degraded`. No reply gives `network.response.unavailable`. Anything else gives no Finding. 160 ms is the existing "help" boundary in `tierFromPing`.
- **Unavailable is not offline.** The probe cannot tell "no reply" from "ping missing", so the Finding says no response was received and never claims the device is down. A failed probe is `data: {status: "unavailable"}`, never RTT 0.
- **Asset IDs** come from the existing device id (MAC when known, else IP) and are opaque downstream. A device with no MAC falls back to an IP-derived id, which is a known Slice 001 limitation.
- **IDs:** Findings are `finding:<category>:<asset>`, stable across scans. Observations are new every scan.
- **Levels:** the five UI levels map to three profiles: `tot`, `toddler` to tots; `tween`, `teen` to teens; `techTitan` to techies.
- **Switching level never re-scans.** The last payload is cached and re-rendered, so Asset, Observation and Finding IDs are identical across profiles.
- **Observation ID in a Finding:** `observations[]` items carry an additive `id`. The contract permits unknown fields.
- Everything has `production_changed: false`. Slice 001 is read-only.

## Testing

```text
npm test        # node --test test/, no extra dependencies
```

Fixtures in `test/fixtures/devices.json` are synthetic and labelled so. They cover a healthy (18 ms), degraded (187 ms) and unavailable device. There are no automated browser tests; the card panel is checked by hand with `npm run dev`.

## Out of scope for Slice 001

Persistence, history, Events, Proposed Actions, new public API routes, and any other repo's data. Do not start Slice 002 until Slice 001 is confirmed working in a browser.
