import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const host = req.headers.get("host") || "auction11.live";
  
  try {
    const res = await fetch(`${apiUrl}/blogs/sitemap.xml`, {
      headers: { host },
      next: { revalidate: 3600 },
    });
    
    if (!res.ok) {
      return new NextResponse("Failed to fetch Sitemap XML", { status: 500 });
    }

    const xml = await res.text();
    return new NextResponse(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "s-maxage=3600, stale-while-revalidate",
      },
    });
  } catch (err: any) {
    return new NextResponse("Internal server error", { status: 500 });
  }
}
