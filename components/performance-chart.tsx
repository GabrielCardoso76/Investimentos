"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { motion } from "framer-motion"
import { useGetPerformance } from "@/hooks/use-portfolio-data"
import { Skeleton } from "./ui/skeleton"

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function PerformanceChart() {
  const { data: performanceData, isLoading, isError, error } = useGetPerformance()

  const renderContent = () => {
    if (isLoading) {
      return <Skeleton className="h-full w-full" />
    }

    if (isError) {
      return <div className="text-red-500 bg-red-100 p-4 rounded-md">Erro ao carregar performance: {error.message}</div>
    }

    if (!performanceData || performanceData.length === 0) {
      return <div className="text-muted-foreground">Não há dados de performance para exibir.</div>
    }

    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={performanceData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="date" className="text-xs" />
          <YAxis tickFormatter={formatCurrency} className="text-xs" />
          <Tooltip
            formatter={(value: number) => [formatCurrency(value), "Valor da Carteira"]}
            labelFormatter={(label) => `Período: ${label}`}
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: "hsl(var(--primary))", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">Evolução da Carteira</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full flex justify-center items-center">
            {renderContent()}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
