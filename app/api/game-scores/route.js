import { prisma } from "@/lib/prisma";

export async function GET() {
  const scores = await prisma.gameScore.findMany({
    orderBy: { score: "desc" },
    take: 10,
  });
  return Response.json({ scores });
}

export async function POST(request) {
  const { name, score } = await request.json();
  if (!name || typeof score !== "number") {
    return Response.json({ error: "Datos inválidos" }, { status: 400 });
  }
  const entry = await prisma.gameScore.create({
    data: { name: name.trim().slice(0, 30), score },
  });
  return Response.json({ entry }, { status: 201 });
}
