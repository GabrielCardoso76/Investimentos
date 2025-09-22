import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // --- NOTA IMPORTANTE SOBRE A LIMITAÇÃO DO SCHEMA ---
    // O schema atual não possui uma tabela ou um tipo de transação para registrar
    // o recebimento de dividendos ou proventos. Para implementar esta funcionalidade,
    // seria necessário adicionar um modelo `Dividend` ao `schema.prisma` ou
    // estender o enum `TransactionType` com uma opção 'DIVIDEND'.
    //
    // Como resultado, esta rota retornará um array vazio.
    const dividendsData: any[] = [];

    return NextResponse.json(dividendsData);

  } catch (error) {
    console.error('Erro ao buscar os dividendos:', error);
    return NextResponse.json(
      { message: 'Erro ao buscar dados dos dividendos.' },
      { status: 500 }
    );
  }
}
