import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { TransactionType } from '@prisma/client';

export async function GET() {
  try {
    // Para este exemplo, vamos pegar o primeiro usuário. Em um app real, você pegaria o ID do usuário logado.
    const user = await prisma.user.findFirst();

    if (!user) {
      return NextResponse.json({ message: 'Nenhum usuário encontrado.' }, { status: 404 });
    }

    // 1. Calcular o Valor Total do Portfólio (Patrimônio)
    // Isso é a soma de (quantidade * preço médio) para cada ativo na carteira.
    const portfolioAssets = await prisma.portfolioAsset.findMany({
      where: { userId: user.id },
    });

    const totalValue = portfolioAssets.reduce((acc, asset) => {
      return acc + (asset.quantity * asset.averagePrice);
    }, 0);

    // 2. Calcular o Valor Total Investido
    // Isso é a soma de (quantidade * preço) de todas as transações de COMPRA.
    const buyTransactions = await prisma.transaction.findMany({
      where: {
        userId: user.id,
        type: TransactionType.BUY,
      },
    });

    const totalInvested = buyTransactions.reduce((acc, transaction) => {
      return acc + (transaction.quantity * transaction.price);
    }, 0);

    // 3. Calcular a Rentabilidade
    const totalReturn = totalValue - totalInvested;
    const returnPercentage = totalInvested > 0 ? (totalReturn / totalInvested) * 100 : 0;

    // 4. Calcular Total de Proventos/Dividendos
    // Nota: O schema atual não modela dividendos. Em uma aplicação real,
    // você teria uma tabela para dividendos ou um tipo de transação específico.
    // Para este exemplo, vamos retornar 0.
    const totalDividends = 0;

    const summaryData = {
      totalValue,
      totalInvested,
      totalReturn,
      returnPercentage,
      totalDividends,
    };

    return NextResponse.json(summaryData);

  } catch (error) {
    console.error('Erro ao buscar o resumo do portfólio:', error);
    return NextResponse.json(
      { message: 'Erro ao buscar dados do resumo do portfólio.' },
      { status: 500 }
    );
  }
}
