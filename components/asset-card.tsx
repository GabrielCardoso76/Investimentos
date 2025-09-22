"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, ResponsiveContainer } from "recharts"
import { motion } from "framer-motion"
import { TrendingUp, TrendingDown } from "lucide-react"

interface AssetCardProps {
  asset: {
    id: string
    ticker: string
    name: string
    type: "stock" | "fii"
    currentPrice: number
    returnPercentage: number
    currentValue: number
    sector: string
  }
  index: number
}

// Mock mini chart data for each asset
const getMiniChartData = (ticker: string) => {
  const baseData = [
    { value: 100 },
    { value: 102 },
    { value: 98 },
    { value: 105 },
    { value: 108 },
    { value: 112 },
    { value: 109 },
    { value: 115 },
  ]

  // Simulate different patterns for different assets
  const multiplier = ticker === "PETR4" ? 1.15 : ticker === "ITSA4" ? 1.14 : 1.08
  return baseData.map((item) => ({ value: item.value * multiplier }))
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(value)
}

export function AssetCard({ asset, index }: AssetCardProps) {
  const miniChartData = getMiniChartData(asset.ticker)
  const isPositive = asset.returnPercentage > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg">{asset.ticker}</CardTitle>
              <p className="text-sm text-muted-foreground truncate">{asset.name}</p>
            </div>
            <Badge variant={asset.type === "stock" ? "default" : "secondary"}>
              {asset.type === "stock" ? "Ação" : "FII"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Mini Chart */}
          <div className="h-16 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={miniChartData}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={isPositive ? "hsl(var(--chart-2))" : "hsl(var(--destructive))"}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Asset Info */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Preço Atual</span>
              <span className="font-medium">{formatCurrency(asset.currentPrice)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Valor Total</span>
              <span className="font-medium">{formatCurrency(asset.currentValue)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Rentabilidade</span>
              <div className="flex items-center gap-1">
                {isPositive ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <span className={`font-medium ${isPositive ? "text-green-500" : "text-red-500"}`}>
                  {asset.returnPercentage > 0 ? "+" : ""}
                  {asset.returnPercentage.toFixed(2)}%
                </span>
              </div>
            </div>

            <div className="pt-2 border-t">
              <span className="text-xs text-muted-foreground">{asset.sector}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
