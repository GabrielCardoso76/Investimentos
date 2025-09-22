import { NextResponse } from 'next/server';

export async function GET() {
  const summaryData = {
    totalValue: 125750.80,
    totalInvested: 100000.00,
    totalReturn: 25750.80,
    returnPercentage: 25.75,
    totalDividends: 8420.50
  };
  return NextResponse.json(summaryData);
}
