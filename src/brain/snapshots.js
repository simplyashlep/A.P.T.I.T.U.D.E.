import { hashString } from "./evidence";

const required = ["entityId", "sourceType", "sourceRecordId", "retrievedAt", "payload"];

export const createSourceSnapshot = ({
  entityId,
  sourceType,
  sourceRecordId,
  sourceUrl = null,
  retrievedAt,
  payload,
  parserVersion = "parser-v1",
}) => {
  const input = { entityId, sourceType, sourceRecordId, retrievedAt, payload };
  for (const field of required) {
    if (input[field] == null) {
      throw new TypeError(`source snapshot is missing required field: ${field}`);
    }
  }
  const canonicalPayload = JSON.stringify(payload);
  const contentHash = hashString(canonicalPayload);
  return Object.freeze({
    id: hashString(`${entityId}:${sourceType}:${sourceRecordId}:${contentHash}`),
    entityId,
    sourceType,
    sourceRecordId,
    sourceUrl,
    retrievedAt,
    payload,
    contentHash,
    parserVersion,
    immutable: true,
  });
};

export const verifySourceSnapshot = (snapshot) => {
  if (!snapshot?.immutable || !snapshot.contentHash) return false;
  return hashString(JSON.stringify(snapshot.payload)) === snapshot.contentHash;
};

export const selectSnapshotsForEntity = (snapshots, entityId, sourceTypes = null) =>
  snapshots.filter((snapshot) => snapshot.entityId === entityId
    && (!sourceTypes || sourceTypes.includes(snapshot.sourceType))
    && verifySourceSnapshot(snapshot));
