/**
 * T4 explanation: consumes Asset / Observation / optional Finding and returns
 * audience wording. Never recollects, never changes IDs or evidence.
 */

export const PROFILES = /** @type {const} */ (["tots", "teens", "techies"]);

const LEVEL_PROFILE = {
  tot: "tots",
  toddler: "tots",
  tween: "teens",
  teen: "teens",
  techTitan: "techies",
};

/** @param {string} level */
export function profileForLevel(level) {
  return LEVEL_PROFILE[level] || "tots";
}

/** Profiles from `profile` onward, for progressive reveal. */
export function profilesFrom(profile) {
  const i = PROFILES.indexOf(profile);
  return PROFILES.slice(i === -1 ? 0 : i);
}

function rttText(observation) {
  const d = observation.data || {};
  return typeof d.value === "number" ? `${d.value} ${d.unit || "ms"}` : "unavailable";
}

const WORDING = {
  "network.response.degraded": {
    tots: {
      headline: "🐌 THIS ONE IS ANSWERING A BIT SLOWLY!",
      body: "It answered us, but it took longer than we'd like.",
      drill: [
        { prompt: "WHY?", text: "We sent it a tiny network message and timed how long the reply took." },
        { prompt: "WHAT'S THAT CALLED?", text: "Response time. Engineers also say latency." },
      ],
    },
    teens: {
      headline: "NETWORK RESPONSE IS SLOW",
      body: "This device replied to our network check, but the response took longer than the expected range. The time a response takes to come back is called latency.",
    },
  },
  "network.response.unavailable": {
    tots: {
      headline: "🙈 THIS ONE DIDN'T ANSWER THIS TIME",
      body: "We called out and didn't hear back. That doesn't mean it's gone for good!",
      drill: [
        { prompt: "WHY?", text: "We sent it a tiny network message and waited a moment for a reply." },
        { prompt: "WHAT'S THAT CALLED?", text: "A ping. No reply is called a timeout." },
      ],
    },
    teens: {
      headline: "NO RESPONSE TO NETWORK CHECK",
      body: "No reply to our ping (ICMP echo) arrived in time. The device could be off, busy, or set to ignore pings, so this alone does not prove it is down.",
    },
  },
  none: {
    tots: {
      headline: "🌟 ANSWERING NICELY!",
      body: "It answered us quickly. Nothing to worry about.",
      drill: [
        { prompt: "WHY?", text: "We sent it a tiny network message and timed how long the reply took." },
        { prompt: "WHAT'S THAT CALLED?", text: "Response time. Engineers also say latency." },
      ],
    },
    teens: {
      headline: "NETWORK RESPONSE IS NORMAL",
      body: "This device replied to our network check within the expected range. No Finding was raised.",
    },
  },
};

/**
 * @param {Record<string, any> | null} finding
 * @param {Record<string, any>} observation
 * @param {Record<string, any>} asset
 * @param {"tots"|"teens"|"techies"} profile
 */
export function explain(finding, observation, asset, profile) {
  if (!observation || !asset) return null;
  const key = finding ? finding.category : "none";
  const words = WORDING[key];
  const refs = {
    assetId: asset.id,
    observationId: observation.id,
    findingId: finding ? finding.id : null,
  };

  const facts = [
    { k: "Finding", v: finding ? finding.category : "none (observation only)" },
    { k: "Asset", v: asset.id },
    { k: "Probe", v: "ICMP echo" },
    { k: "RTT", v: rttText(observation) },
    { k: "Source", v: `${observation.producer.id} / ${observation.source.id || observation.source.kind}` },
    { k: "Observation", v: observation.id },
    { k: "Finding ID", v: finding ? finding.id : "none" },
    { k: "Observed", v: observation.observed_at },
  ];

  if (profile === "techies" || !words) {
    return {
      profile: "techies",
      headline: finding ? finding.category : "network.icmp.rtt",
      body: finding ? finding.summary : `ICMP RTT ${rttText(observation)}; no Finding warranted.`,
      drill: [],
      facts,
      refs,
    };
  }

  const w = words[profile] || words.tots;
  return {
    profile,
    headline: w.headline,
    body: w.body,
    drill: w.drill || [],
    facts: profile === "teens" ? [{ k: "Observed response", v: rttText(observation) }] : [],
    refs,
  };
}
