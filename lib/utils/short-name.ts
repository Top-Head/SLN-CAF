const PARTICLES = new Set(["da", "de", "do", "das", "dos", "e"]);

export function shortName(name: string) {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter((part) => !PARTICLES.has(part.toLowerCase()));
  if (parts.length <= 2) return parts.join(" ");
  return `${parts[0]} ${parts[1][0]}. ${parts[parts.length - 1]}`;
}
