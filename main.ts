// news-image-20261118, entry 2: write the day's front page to /output/entry.png.
//
// The poster (Wednesday 18 November 2026: 38 stories on one page - the
// Shenzhen summit track, the Gulf strikes, Voyager 1's one-light-day
// crossing, Cyclone Akvan, the EU's Ukraine loan and the Jeffries vote,
// plus a dotted world map, a stat strip and a date-check box, all drawn
// once with PIL) is stored in image-data.ts as a single base64 line.
// This launcher only decodes it and writes it out, using the Node
// standard library alone and no network, so two runs always produce the
// same bytes. Entry 2 replaces entry 1's six-story page: the date check
// now keeps Tuesday 17 November news (Nvidia's results, the Alaska
// Senate call) off the page entirely.
import { Buffer } from "node:buffer";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { ENTRY_PNG_BASE64 } from "./image-data.ts";

function decodePoster(): Buffer {
  const bytes = Buffer.from(ENTRY_PNG_BASE64, "base64");
  // A PNG always starts with these eight bytes; anything else means the
  // embedded payload is damaged, so refuse rather than write junk.
  const signature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  if (bytes.length < 8 || !signature.every((b, i) => bytes[i] === b)) {
    throw new Error("embedded poster is not a PNG");
  }
  return bytes;
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.png"), decodePoster());
