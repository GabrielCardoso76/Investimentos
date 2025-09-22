import { PrismaClient, TransactionType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // 1. Create a sample user
  const user = await prisma.user.create({
    data: {
      email: 'user@example.com',
      name: 'John Doe',
    },
  });
  console.log(`Created user: ${user.name} (ID: ${user.id})`);

  // 2. Create sample assets
  const petr4 = await prisma.asset.create({
    data: {
      ticker: 'PETR4',
      name: 'Petrobras PN',
      type: 'Ação',
      sector: 'Energia',
    },
  });

  const itsa4 = await prisma.asset.create({
    data: {
      ticker: 'ITSA4',
      name: 'Itaúsa PN',
      type: 'Ação',
      sector: 'Financeiro',
    },
  });

  const hglg11 = await prisma.asset.create({
    data: {
      ticker: 'HGLG11',
      name: 'CSHG Logística FII',
      type: 'FII',
      sector: 'Logística',
    },
  });
  console.log('Created assets: PETR4, ITSA4, HGLG11');

  // 3. Create sample transactions
  const transactionsData = [
    { assetId: petr4.id, quantity: 100, price: 30.50, date: new Date('2023-01-15') },
    { assetId: petr4.id, quantity: 50, price: 32.00, date: new Date('2023-03-20') },
    { assetId: itsa4.id, quantity: 200, price: 10.80, date: new Date('2023-02-10') },
    { assetId: hglg11.id, quantity: 50, price: 105.00, date: new Date('2023-04-05') },
  ];

  for (const t of transactionsData) {
    await prisma.transaction.create({
      data: {
        userId: user.id,
        assetId: t.assetId,
        type: TransactionType.BUY,
        quantity: t.quantity,
        price: t.price,
        date: t.date,
      },
    });
  }
  console.log(`Created ${transactionsData.length} transactions.`);

  // 4. Populate PortfolioAsset based on transactions
  const userTransactions = await prisma.transaction.findMany({
    where: { userId: user.id },
  });

  // Group transactions by asset
  const portfolio: { [key: string]: { totalQuantity: number; totalCost: number } } = {};
  for (const t of userTransactions) {
    if (!portfolio[t.assetId]) {
      portfolio[t.assetId] = { totalQuantity: 0, totalCost: 0 };
    }
    if (t.type === TransactionType.BUY) {
      portfolio[t.assetId].totalQuantity += t.quantity;
      portfolio[t.assetId].totalCost += t.quantity * t.price;
    }
    // Note: Add SELL logic here if needed in the future
  }

  // Create or update PortfolioAsset entries
  for (const assetId in portfolio) {
    const { totalQuantity, totalCost } = portfolio[assetId];
    const averagePrice = totalCost / totalQuantity;

    await prisma.portfolioAsset.create({
      data: {
        userId: user.id,
        assetId: assetId,
        quantity: totalQuantity,
        averagePrice: averagePrice,
      },
    });
  }
  console.log('Populated PortfolioAsset table.');

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
