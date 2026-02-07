import { json } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const metrics = await prisma.metrics.findMany({
      orderBy: { date: 'desc' }
    });
    await prisma.$disconnect();
    return json(metrics);
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}
