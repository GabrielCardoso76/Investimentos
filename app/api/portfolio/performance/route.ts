import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { TransactionType } from '@prisma/client';

export async function GET() {
  try {
    const user = await prisma.user.findFirst();
    if (!user) {
      return NextResponse.json({ message: 'Nenhum usuário encontrado.' }, { status: 404 });
    }

    // --- NOTA IMPORTANTE SOBRE A LIMITAÇÃO DO SCHEMA ---
    // O schema atual não armazena snapshots históricos do valor do portfólio.
    // Para gerar um gráfico de performance preciso, seria necessário registrar o valor
    // total da carteira em intervalos regulares (diários, mensais, etc.).
    //
    // A lógica abaixo é uma SIMPLIFICAÇÃO. Ela cria pontos no gráfico baseados
    // no valor acumulado após cada transação de compra, o que não reflete a
    // performance real (que inclui flutuações de preço).

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: user.id,
        type: TransactionType.BUY, // Apenas compras para simplificar
      },
      orderBy: {
        date: 'asc',
      },
    });

    let accumulatedValue = 0;
    const performanceData = transactions.map(t => {
      accumulatedValue += t.quantity * t.price;
      return {
        // Formata a data para "Mês 'Ano" (ex: Jan '23)
        date: t.date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }).replace('.', ''),
        value: accumulatedValue,
      };
    });

    // Para garantir que o gráfico tenha pelo menos um ponto inicial, se não houver transações.
    if (performanceData.length === 0) {
        performanceData.push({ date: 'Início', value: 0 });
    }

    return NextResponse.json(performanceData);

  } catch (error) {
    console.error('Erro ao buscar a performance do portfólio:', error);
    return NextResponse.json(
      { message: 'Erro ao buscar dados da performance do portfólio.' },
      { status: 500 }
    );
  }
}
