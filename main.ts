// news-image-20261118, entry 3: write the day's front page to /output/entry.png.
//
// The poster (Wednesday 18 November 2026: 52 stories on one page — sixteen
// featured stories with original PIL drawings, a UTC timeline, region and
// field strips, a dotted world map, a six-number stat strip, a verification
// legend and a date-check box naming the Tuesday 17 November stories left
// off the page, plus a "not yet" line) is stored in image-data.ts as a
// single base64 line. This launcher only decodes it and writes it out,
// using the Node standard library alone and no network, so two runs always
// produce the same bytes. Entry 3 replaces entry 2's 38-story page: the
// story count rises to 52, five briefs are promoted to featured drawings,
// and the timeline, field strip, verification legend and "not yet" line
// are new. The six excluded Tuesday stories (Nvidia's results, the Alaska
// Senate call, the Board of Peace's Gaza report, the Knesset speaker vote,
// Mongolia's president's offer to quit, the Kerch Bridge collapse) never
// appear as stories on the page.
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
