import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Para este exemplo, vamos pegar o primeiro usuário. Em um app real, você pegaria o ID do usuário logado.
    const user = await prisma.user.findFirst();

    if (!user) {
      return NextResponse.json({ message: 'Nenhum usuário encontrado.' }, { status: 404 });
    }

    const portfolioAssets = await prisma.portfolioAsset.findMany({
      where: { userId: user.id },
      include: {
        asset: true, // Inclui os dados do ativo relacionado
      },
    });

    // Mapeia os dados para o formato que o front-end espera
    const formattedAssets = portfolioAssets.map(pa => ({
      id: pa.asset.ticker,
      ticker: pa.asset.ticker,
      name: pa.asset.name,
      type: pa.asset.type,
      // Nota: O preço atual (currentPrice) não está no nosso DB.
      // Em uma aplicação real, isso viria de uma API de cotações em tempo real.
      // Para este exemplo, vamos omitir ou usar o preço médio.
      currentPrice: pa.averagePrice, // Usando o preço médio como substituto
      currentValue: pa.quantity * pa.averagePrice, // Valor total do ativo na carteira
      returnPercentage: 0, // A rentabilidade real precisaria de dados de preço atual.
      sector: pa.asset.sector,
    }));

    return NextResponse.json(formattedAssets);
  } catch (error) {
    console.error('Erro ao buscar ativos:', error);
    return NextResponse.json(
      { message: 'Erro ao buscar dados dos ativos.' },
      { status: 500 }
    );
  }
}
