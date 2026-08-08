import { getDatabase } from "@/lib/mongodb";

type ReciterImage = { secureUrl?: string };

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const numericId = Number((await context.params).id);
  if (!Number.isInteger(numericId) || numericId < 1) return new Response(null, { status: 404 });

  const prefix = String(numericId).padStart(3, "0").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const asset = await (await getDatabase()).collection<ReciterImage>("media_assets").findOne(
    { publicPath: { $regex: `^reciter_images/${prefix}-` } },
    { projection: { secureUrl: 1 } },
  );
  if (!asset?.secureUrl) return new Response(null, { status: 404 });

  return new Response(null, {
    status: 307,
    headers: {
      Location: asset.secureUrl,
      "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
