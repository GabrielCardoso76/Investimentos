import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const user = await prisma.user.findFirst();

    if (!user) {
      return NextResponse.json({ message: 'Nenhum usuário encontrado.' }, { status: 404 });
    }

    const portfolioAssets = await prisma.portfolioAsset.findMany({
      where: { userId: user.id },
      include: {
        asset: {
          select: {
            type: true, // Apenas precisamos do tipo do ativo
          },
        },
      },
    });

    // Agrupa os ativos por tipo e soma os valores
    const allocationMap = new Map<string, number>();

    for (const pa of portfolioAssets) {
      const assetType = pa.asset.type;
      const assetValue = pa.quantity * pa.averagePrice;

      const currentTotal = allocationMap.get(assetType) || 0;
      allocationMap.set(assetType, currentTotal + assetValue);
    }

    // Mapeia as cores para cada tipo de ativo. Em um app real, isso poderia ser mais dinâmico.
    const typeColorMap: { [key: string]: string } = {
      'Ação': '#3b82f6', // blue-500
      'FII': '#16a34a',  // green-600
      'Renda Fixa': '#ef4444', // red-500
      'Cripto': '#f97316', // orange-500
    };

    // Formata os dados para o formato que o gráfico do front-end espera
    const allocationData = Array.from(allocationMap.entries()).map(([type, value]) => ({
      name: type,
      value: value,
      color: typeColorMap[type] || '#6b7280', // gray-500 como fallback
    }));

    return NextResponse.json(allocationData);

  } catch (error) {
    console.error('Erro ao buscar a alocação do portfólio:', error);
    return NextResponse.json(
      { message: 'Erro ao buscar dados da alocação do portfólio.' },
      { status: 500 }
    );
  }
}
