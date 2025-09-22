"use client"

import { MetricCard } from "./metric-card"
import { motion } from "framer-motion"

// Mock data baseado na estrutura sugerida
const portfolioData = {
  totalValue: 125750.8,
  totalInvested: 100000.0,
  totalReturn: 25750.8,
  returnPercentage: 25.75,
  totalDividends: 8420.5,
}

export function PortfolioSummary() {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    return `${value > 0 ? "+" : ""}${value.toFixed(2)}%`
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
        value={formatCurrency(portfolioData.totalValue)}
        subtitle="Patrimônio atual"
        trend="up"
        delay={0}
      />

      <MetricCard
        title="Valor Investido"
        value={formatCurrency(portfolioData.totalInvested)}
        subtitle="Capital aplicado"
        trend="neutral"
        delay={0.1}
      />

      <MetricCard
        title="Rentabilidade"
        value={formatCurrency(portfolioData.totalReturn)}
        subtitle={formatPercentage(portfolioData.returnPercentage)}
        trend="up"
        delay={0.2}
      />

      <MetricCard
        title="Proventos"
        value={formatCurrency(portfolioData.totalDividends)}
        subtitle="Total recebido"
        trend="up"
        delay={0.3}
      />
    </motion.div>
  )
}
