export function dedupeAppend(existing, incoming) {
  const map = new Map();
  for (const f of existing) map.set(f.did, f);
  for (const f of incoming) map.set(f.did, f);
  return Array.from(map.values());
}

export function numberOfHoursAgo(date) {
  const now = new Date();
  const past = new Date(date);
  const diffInMs = now - past;
  console.log({ now, past, diffInMs });
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  return diffInHours;
}

export function numberOfHoursOrMinutesAgo(date) {
  const now = new Date();
  const past = new Date(date);
  const diffInMs = now - past;
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  if (diffInHours > 0) {
    return diffInHours + "h";
  }
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  return diffInMinutes + "m";
}

export function formatDate(date) {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
