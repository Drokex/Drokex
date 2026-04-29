const { PrismaClient } = require("../generated/prisma");
const { sampleProducts } = require("../lib/sample-products");

const prisma = new PrismaClient();

async function main() {
  for (const product of sampleProducts) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        ...product,
      },
      create: {
        ...product,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
