import { NextResponse } from 'next/server';

export async function GET() {
  const allocationData = [
    { "name": "Ações", "value": 27650.00, "color": "#3b82f6" },
    { "name": "FIIs", "value": 20500.00, "color": "#16a34a" },
    { "name": "Renda Fixa", "value": 50000.00, "color": "#ef4444" },
    { "name": "Cripto", "value": 27600.80, "color": "#f97316" }
  ];
  return NextResponse.json(allocationData);
}
