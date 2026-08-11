export interface ParsedPair {
  a: string;
  b: string;
}

/**
 * Parses the "one per line, A | B" convention used by iconGrid, statsGrid,
 * and faq section data into structured pairs. Blank lines and lines without
 * a "|" are skipped rather than throwing, so a half-finished edit in the
 * admin never breaks the live page.
 */
export function parsePairLines(source: string | undefined | null): ParsedPair[] {
  if (!source) return [];
  return source
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [a, ...rest] = line.split("|");
      return { a: a?.trim() ?? "", b: rest.join("|").trim() };
    })
    .filter((pair) => pair.a);
}
