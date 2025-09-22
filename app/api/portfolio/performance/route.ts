import { NextResponse } from 'next/server';

export async function GET() {
  const performanceData = [
    { "date": "Jan '23", "value": 100000 },
    { "date": "Fev '23", "value": 102000 },
    { "date": "Mar '23", "value": 105000 },
    { "date": "Abr '23", "value": 110000 },
    { "date": "Mai '23", "value": 115000 },
    { "date": "Jun '23", "value": 125750.80 }
  ];
  return NextResponse.json(performanceData);
}
