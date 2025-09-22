import { NextResponse } from 'next/server';

export async function GET() {
  const dividendsData = [
    { "date": "2023-05-15T12:00:00Z", "ticker": "PETR4", "value": 350.20 },
    { "date": "2023-05-20T12:00:00Z", "ticker": "HGLG11", "value": 150.00 },
    { "date": "2023-06-01T12:00:00Z", "ticker": "ITSA4", "value": 220.50 }
  ];
  return NextResponse.json(dividendsData);
}
