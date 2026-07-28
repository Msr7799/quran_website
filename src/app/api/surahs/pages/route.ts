import { NextResponse } from "next/server";
import { getSurahs } from "@/lib/quran";

export const dynamic = "force-dynamic";

// First page of each surah in the standard 604-page Madani Mushaf.
const MUSHAF_SURAH_PAGES = [
  1, 2, 50, 77, 106, 128, 151, 177, 187, 208, 221, 235, 249, 255, 262, 267,
  282, 293, 305, 312, 322, 332, 342, 350, 359, 367, 377, 385, 396, 404, 411, 415,
  418, 428, 434, 440, 446, 453, 458, 467, 477, 483, 489, 496, 499, 502, 507, 511,
  515, 518, 520, 523, 526, 528, 531, 534, 537, 542, 545, 549, 551, 553, 554, 556,
  558, 560, 562, 564, 566, 568, 570, 572, 574, 575, 577, 578, 580, 582, 583, 585,
  586, 587, 587, 589, 590, 591, 591, 592, 593, 594, 595, 595, 596, 596, 597, 597,
  598, 598, 599, 599, 600, 600, 601, 601, 601, 602, 602, 602, 603, 603, 603, 604,
  604, 604,
];

export async function GET() {
  const metadata = await getSurahs();
  const surahs = metadata.map((meta) => {
    const pdfPage = MUSHAF_SURAH_PAGES[meta.number - 1] + 6;
    // Address the open spread by the facing page: left starts use the right
    // page number and right starts use the left page number.
    const spreadPage = pdfPage % 2 === 0 ? pdfPage + 1 : pdfPage - 1;
    return { number: meta.number, name: meta.name.ar, page: Math.max(7, Math.min(610, spreadPage)), contentPage: pdfPage };
  });
  return NextResponse.json(surahs, { headers: { "Cache-Control": "no-store, max-age=0" } });
}
