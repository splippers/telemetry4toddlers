/**
 * Standalone LAN API (:8788) — optional when you want HTTP outside Vite
 * (`npm run dev:split-stack`). Normally `vite` serves /api internally.
 */
import http from "node:http";
import { dispatchApiRoutes, pathnameOnly } from "./httpApi.mjs";
import { scanLan } from "./lanScan.mjs";
import { createScanCache } from "./scanCache.mjs";

const API_PORT = Number(process.env.T4T_API_PORT || 8788);
const API_HOST = process.env.T4T_API_HOST || "0.0.0.0";
// T4T_SCAN_INTERVAL_S > 0: scan in the background and serve the cached last scan, so polling never triggers a scan.
const SCAN_INTERVAL_S = Number(process.env.T4T_SCAN_INTERVAL_S || 0);
const scanCache = SCAN_INTERVAL_S > 0 ? createScanCache(scanLan, { intervalMs: SCAN_INTERVAL_S * 1000 }) : null;

const server = http.createServer((req, res) => {
  const p = pathnameOnly(req.url || "/");
  if (!p.startsWith("/api")) {
    res.statusCode = 404;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify({
      error: "STANDALONE_ROOT",
      message: "This process only serves /api/* — use npm run dev (Vite) for the UI.",
    }));
    return;
  }
  dispatchApiRoutes(req, res, {
    source: "standalone-tcp",
    portHint: API_PORT,
    scanCache,
  }).catch((e) => {
    try {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.end(JSON.stringify({
        error: "FATAL_API",
        message: e instanceof Error ? e.message : String(e),
      }));
    } catch {
      /* ignore */
    }
  });
});

server.listen(API_PORT, API_HOST, () => {
  scanCache?.start();
  const url = `http://${API_HOST === "0.0.0.0" ? "0.0.0.0" : API_HOST}:${API_PORT}`;
  // eslint-disable-next-line no-console
  console.error(
    `[t4t-api] standalone tcp ${url} (optional — Vite normally embeds /api instead)`,
  );
});
