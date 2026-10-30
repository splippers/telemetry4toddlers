/** Hand-written checks from each contract's "Validation Rules". Return error strings ([] = valid). */

const SOURCE_KINDS = ["live", "snapshot", "historical", "synthetic", "vendor", "user", "generalised"];
const OBS_SOURCE_KINDS = ["live", "snapshot", "historical", "synthetic", "vendor", "user"];
const ASSET_STATUS = ["active", "inactive", "retired", "unknown"];
const SEVERITY = ["info", "notice", "warning", "critical"];
const STATE = ["active", "acknowledged", "resolved", "suppressed"];
const UTC_ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/;

const str = (v) => typeof v === "string" && v.length > 0;
const obj = (v) => v !== null && typeof v === "object" && !Array.isArray(v);

export function validateAsset(a) {
  const e = [];
  if (!obj(a)) return ["asset is not an object"];
  if (a.schema !== "vna.asset/0.1") e.push("schema must be vna.asset/0.1");
  if (!str(a.id)) e.push("id must be a non-empty string");
  if (!str(a.kind)) e.push("kind must be a non-empty string");
  if (!str(a.name)) e.push("name must be a non-empty string");
  if (!obj(a.source)) e.push("source must be an object");
  else if (!SOURCE_KINDS.includes(a.source.kind)) e.push("source.kind not recognised");
  if (!ASSET_STATUS.includes(a.status)) e.push("status not recognised");
  if (a.aliases !== undefined) {
    if (!Array.isArray(a.aliases)) e.push("aliases must be an array");
    else a.aliases.forEach((x, i) => {
      if (!obj(x) || !str(x.type)) e.push(`aliases[${i}].type required`);
      if (!obj(x) || !str(x.value)) e.push(`aliases[${i}].value required`);
    });
  }
  if (a.platform !== undefined && !obj(a.platform)) e.push("platform must be an object");
  if (a.description !== undefined && typeof a.description !== "string") e.push("description must be a string");
  if (a.labels !== undefined && !(Array.isArray(a.labels) && a.labels.every((x) => typeof x === "string"))) {
    e.push("labels must be an array of strings");
  }
  if (a.attributes !== undefined && !obj(a.attributes)) e.push("attributes must be an object");
  return e;
}

export function validateObservation(o) {
  const e = [];
  if (!obj(o)) return ["observation is not an object"];
  if (o.schema !== "vna.observation/0.1") e.push("schema must be vna.observation/0.1");
  if (!str(o.id)) e.push("id must be a non-empty string");
  if (!obj(o.producer)) e.push("producer must be an object");
  else {
    if (!str(o.producer.id)) e.push("producer.id required");
    if (!str(o.producer.type)) e.push("producer.type required");
  }
  if (!obj(o.source)) e.push("source must be an object");
  else if (!OBS_SOURCE_KINDS.includes(o.source.kind)) e.push("source.kind not recognised");
  if (typeof o.observed_at !== "string" || !UTC_ISO.test(o.observed_at)) e.push("observed_at must be UTC ISO 8601");
  if (!str(o.type)) e.push("type must be a non-empty string");
  if (!obj(o.subject)) e.push("subject must be an object");
  else if (!str(o.subject.type)) e.push("subject.type required");
  if (!obj(o.data)) e.push("data must be an object");
  if (typeof o.production_changed !== "boolean") e.push("production_changed must be a boolean");
  if (o.method !== undefined) {
    if (!obj(o.method)) e.push("method must be an object");
    else if (!str(o.method.type)) e.push("method.type required");
  }
  if (o.quality !== undefined && !obj(o.quality)) e.push("quality must be an object");
  if (o.attributes !== undefined && !obj(o.attributes)) e.push("attributes must be an object");
  return e;
}

export function validateFinding(f) {
  const e = [];
  if (!obj(f)) return ["finding is not an object"];
  if (f.schema !== "vna.finding/0.1") e.push("schema must be vna.finding/0.1");
  if (!str(f.id)) e.push("id must be a non-empty string");
  if (!obj(f.producer)) e.push("producer must be an object");
  else {
    if (!str(f.producer.id)) e.push("producer.id required");
    if (!str(f.producer.type)) e.push("producer.type required");
  }
  if (!obj(f.source)) e.push("source must be an object");
  else if (!OBS_SOURCE_KINDS.includes(f.source.kind)) e.push("source.kind not recognised");
  if (typeof f.observed_at !== "string" || !UTC_ISO.test(f.observed_at)) e.push("observed_at must be UTC ISO 8601");
  if (!str(f.category)) e.push("category must be a non-empty string");
  if (!SEVERITY.includes(f.severity)) e.push("severity not recognised");
  if (!STATE.includes(f.state)) e.push("state not recognised");
  if (!obj(f.subject)) e.push("subject must be an object");
  else if (!str(f.subject.type)) e.push("subject.type required");
  if (!str(f.summary)) e.push("summary must be a non-empty string");
  if (typeof f.production_changed !== "boolean") e.push("production_changed must be a boolean");
  if (f.confidence !== undefined && !(typeof f.confidence === "number" && f.confidence >= 0 && f.confidence <= 1)) {
    e.push("confidence must be between 0.0 and 1.0");
  }
  if (f.observations !== undefined && !Array.isArray(f.observations)) e.push("observations must be an array");
  if (f.evidence !== undefined) {
    if (!Array.isArray(f.evidence)) e.push("evidence must be an array");
    else f.evidence.forEach((x, i) => { if (!obj(x) || !str(x.type)) e.push(`evidence[${i}].type required`); });
  }
  if (f.recommendations !== undefined) {
    if (!Array.isArray(f.recommendations)) e.push("recommendations must be an array");
    else f.recommendations.forEach((x, i) => { if (!obj(x) || !str(x.type)) e.push(`recommendations[${i}].type required`); });
  }
  if (f.relationships !== undefined) {
    if (!Array.isArray(f.relationships)) e.push("relationships must be an array");
    else f.relationships.forEach((x, i) => {
      if (!obj(x) || !str(x.type) || !str(x.target_id)) e.push(`relationships[${i}] needs type and target_id`);
    });
  }
  if (f.attributes !== undefined && !obj(f.attributes)) e.push("attributes must be an object");
  return e;
}
