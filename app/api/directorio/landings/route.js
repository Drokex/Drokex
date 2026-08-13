import { NextResponse } from "next/server";
import { getProLandingsLite } from "@/lib/proveedor-pro-landings";

export async function GET() {
  const landings = await getProLandingsLite();
  return NextResponse.json({ landings });
}
