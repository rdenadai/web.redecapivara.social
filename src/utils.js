export function dedupeAppend(existing, incoming) {
  const map = new Map();
  for (const f of existing) map.set(f.did, f);
  for (const f of incoming) map.set(f.did, f);
  return Array.from(map.values());
}
