import { getDatabase } from "@/lib/mongodb";

type MediaAsset = {
  publicPath: string;
  secureUrl?: string;
};

export async function GET(request: Request, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  const publicPath = path.join("/");
  const asset = await (await getDatabase()).collection<MediaAsset>("media_assets").findOne(
    { publicPath },
    { projection: { secureUrl: 1 } },
  );

  if (asset?.secureUrl) {
    return new Response(null, {
      status: 307,
      headers: {
        Location: asset.secureUrl,
        "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
      },
    });
  }

  // Keep the five files that exceed the MCP upload limit available locally.
  return Response.redirect(new URL(`/${path.map(encodeURIComponent).join("/")}`, request.url), 307);
}
