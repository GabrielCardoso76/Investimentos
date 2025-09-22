"use client"

import { MetricCard } from "./metric-card"
import { motion } from "framer-motion"
import { useGetSummary } from "@/hooks/use-portfolio-data"
import { Skeleton } from "./ui/skeleton"

export function PortfolioSummary() {
  const { data: summaryData, isLoading, isError, error } = useGetSummary()

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    return `${value > 0 ? "+" : ""}${value.toFixed(2)}%`
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="col-span-full text-red-500 bg-red-100 border border-red-500 rounded-lg p-4">
        Erro ao carregar o resumo do portfólio: {error.message}
      </div>
    )
  }

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <MetricCard
        title="Valor Total"
        value={formatCurrency(summaryData.totalValue)}
        subtitle="Patrimônio atual"
        trend="up"
        delay={0}
      />
      <MetricCard
        title="Valor Investido"
        value={formatCurrency(summaryData.totalInvested)}
        subtitle="Capital aplicado"
        trend="neutral"
        delay={0.1}
      />
      <MetricCard
        title="Rentabilidade"
        value={formatCurrency(summaryData.totalReturn)}
        subtitle={formatPercentage(summaryData.returnPercentage)}
        trend="up"
        delay={0.2}
      />
      <MetricCard
        title="Proventos"
        value={formatCurrency(summaryData.totalDividends)}
        subtitle="Total recebido"
        trend="up"
        delay={0.3}
      />
    </motion.div>
  )
}

const CardSkeleton = () => (
  <div className="p-4 bg-card rounded-lg border">
    <Skeleton className="h-6 w-1/2 mb-2" />
    <Skeleton className="h-8 w-3/4" />
  </div>
)
