"use client"

import { useMemo } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { useGetAllocation } from "@/hooks/use-portfolio-data"
import { Skeleton } from "./ui/skeleton"

type AllocationData = {
  name: string;
  value: number;
  color: string;
};

export function AssetAllocationChart() {
  const { data: assetAllocation, isLoading, isError, error } = useGetAllocation()

  const processedData = useMemo(() => {
    if (!assetAllocation) return []
    const totalValue = assetAllocation.reduce((sum: number, entry: AllocationData) => sum + entry.value, 0)
    return assetAllocation.map((entry: AllocationData) => ({
      ...entry,
      percentage: totalValue > 0 ? ((entry.value / totalValue) * 100).toFixed(2) : "0.00",
    }))
  }, [assetAllocation])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg text-sm">
          <p className="font-medium text-popover-foreground">{data.name}</p>
          <p className="text-muted-foreground">
            {formatCurrency(data.value)} ({data.percentage}%)
          </p>
        </div>
      )
    }
    return null
  }

  const renderContent = () => {
    if (isLoading) {
      return <Skeleton className="h-64 w-64 rounded-full" />
    }

    if (isError) {
      return <div className="text-red-500 bg-red-100 p-4 rounded-md">Erro ao carregar dados de alocação: {error.message}</div>
    }

    if (!processedData || processedData.length === 0) {
        return <div className="text-muted-foreground">Não há dados de alocação para exibir.</div>
    }

    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={processedData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={120}
            paddingAngle={2}
            dataKey="value"
            nameKey="name"
          >
            {processedData.map((entry) => (
              <Cell key={`cell-${entry.name}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => <span className="text-sm text-muted-foreground">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Distribuição por Categoria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex justify-center items-center">
            {renderContent()}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
