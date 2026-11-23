/**
 * Background scan cache for the standalone API. One scan runs at a time; each finishes, then the next starts
 * `intervalMs` later. get() returns the last good payload (stale rather than empty if a later scan fails), waiting
 * for the first scan if there is none yet. Read-only: it only calls the scan function it is given.
 */
export function createScanCache(scan, { intervalMs = 30000, log = (m) => console.error(m), timers = { setTimeout, clearTimeout } } = {}) {
  let last = null;
  let lastError = null;
  let inflight = null;
  let timer = null;
  let stopped = false;

  async function run() {
    if (inflight) return inflight;
    inflight = (async () => {
      try {
        const payload = await scan();
        if (payload && !payload.error) { last = payload; lastError = null; }
        else lastError = payload?.error || "scan returned no payload";
      } catch (e) {
        lastError = e instanceof Error ? e.message : String(e);
        log(`[t4t-api] scan failed: ${lastError}`);
      } finally {
        inflight = null;
      }
      return last;
    })();
    return inflight;
  }

  function schedule() {
    if (stopped) return;
    timer = timers.setTimeout(async () => { await run(); schedule(); }, intervalMs);
    timer.unref?.();
  }

  return {
    start() { run().then(schedule); },
    stop() { stopped = true; if (timer) timers.clearTimeout(timer); },
    async get() {
      if (!last) await run();
      if (!last) throw new Error(lastError || "no scan available");
      return last;
    },
  };
}
