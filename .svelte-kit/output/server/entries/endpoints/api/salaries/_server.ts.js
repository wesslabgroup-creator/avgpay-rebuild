import { json } from "@sveltejs/kit";
import { s as salarySchema } from "../../../../chunks/schema.js";
import { PrismaClient } from "@prisma/client";
const prismaClientSingleton = () => {
  return new PrismaClient();
};
const prisma = globalThis.prisma ?? prismaClientSingleton();
if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;
async function GET() {
  try {
    const salaries = await prisma.salary.findMany({
      orderBy: {
        createdAt: "desc"
      },
      take: 100
    });
    return json(salaries, { status: 200 });
  } catch (error) {
    console.error(error);
    return json({ error: "Failed to retrieve salary data." }, { status: 500 });
  }
}
async function POST({ request }) {
  try {
    const body = await request.json();
    const result = salarySchema.safeParse(body);
    if (!result.success) {
      return json(
        { error: "Invalid data provided.", details: result.error.flatten() },
        { status: 400 }
      );
    }
    const newSalary = await prisma.salary.create({
      data: result.data
    });
    return json(newSalary, { status: 201 });
  } catch (error) {
    console.error(error);
    return json({ error: "Failed to submit salary data." }, { status: 500 });
  }
}
export {
  GET,
  POST
};
