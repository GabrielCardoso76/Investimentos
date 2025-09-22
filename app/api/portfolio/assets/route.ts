import { NextResponse } from 'next/server';

export async function GET() {
  const assetsData = [
    {
      id: "PETR4",
      ticker: "PETR4",
      name: "Petrobras PN",
      type: "stock",
      currentPrice: 32.80,
      returnPercentage: 15.09,
      currentValue: 16400.00,
      sector: "Energia"
    },
    {
      id: "ITSA4",
      ticker: "ITSA4",
      name: "Itaúsa PN",
      type: "stock",
      currentPrice: 11.25,
      returnPercentage: 14.80,
      currentValue: 11250.00,
      sector: "Financeiro"
    },
    {
      id: "HGLG11",
      ticker: "HGLG11",
      name: "CSHG Logística FII",
      type: "fii",
      currentPrice: 102.50,
      returnPercentage: 7.89,
      currentValue: 20500.00,
      sector: "Logística"
    }
  ];
  return NextResponse.json(assetsData);
}
