
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

async function main() {
    console.log('Keys on prisma client:', Object.keys(prisma));
    try {
        const companies = await prisma.company.findMany({ take: 1 });
        console.log('Successfully fetched companies:', companies);
    } catch (e) {
        console.error('Error fetching companies:', e);
    }
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
