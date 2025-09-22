"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarDays, TrendingUp, DollarSign } from "lucide-react"
import { format, isAfter, subDays, subMonths, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"

// Mock data expandido com mais histórico de dividendos
const mockDividends = [
  // PETR4 dividends
  {
    id: "1",
    ticker: "PETR4",
    name: "Petrobras PN",
    date: "2024-01-10",
    value: 0.85,
    type: "dividend",
    quantity: 500,
    totalReceived: 425.0,
  },
  {
    id: "2",
    ticker: "PETR4",
    name: "Petrobras PN",
    date: "2023-10-15",
    value: 1.2,
    type: "dividend",
    quantity: 500,
    totalReceived: 600.0,
  },
  {
    id: "3",
    ticker: "PETR4",
    name: "Petrobras PN",
    date: "2023-07-12",
    value: 0.95,
    type: "dividend",
    quantity: 500,
    totalReceived: 475.0,
  },
  {
    id: "4",
    ticker: "PETR4",
    name: "Petrobras PN",
    date: "2023-04-18",
    value: 1.1,
    type: "dividend",
    quantity: 500,
    totalReceived: 550.0,
  },

  // ITSA4 dividends
  {
    id: "5",
    ticker: "ITSA4",
    name: "Itaúsa PN",
    date: "2024-01-05",
    value: 0.15,
    type: "dividend",
    quantity: 1000,
    totalReceived: 150.0,
  },
  {
    id: "6",
    ticker: "ITSA4",
    name: "Itaúsa PN",
    date: "2023-09-20",
    value: 0.18,
    type: "dividend",
    quantity: 1000,
    totalReceived: 180.0,
  },
  {
    id: "7",
    ticker: "ITSA4",
    name: "Itaúsa PN",
    date: "2023-06-15",
    value: 0.12,
    type: "dividend",
    quantity: 1000,
    totalReceived: 120.0,
  },
  {
    id: "8",
    ticker: "ITSA4",
    name: "Itaúsa PN",
    date: "2023-03-10",
    value: 0.16,
    type: "dividend",
    quantity: 1000,
    totalReceived: 160.0,
  },

  // HGLG11 dividends
  {
    id: "9",
    ticker: "HGLG11",
    name: "CSHG Logística FII",
    date: "2024-01-12",
    value: 0.95,
    type: "dividend",
    quantity: 200,
    totalReceived: 190.0,
  },
  {
    id: "10",
    ticker: "HGLG11",
    name: "CSHG Logística FII",
    date: "2023-12-15",
    value: 0.92,
    type: "dividend",
    quantity: 200,
    totalReceived: 184.0,
  },
  {
    id: "11",
    ticker: "HGLG11",
    name: "CSHG Logística FII",
    date: "2023-11-10",
    value: 0.88,
    type: "dividend",
    quantity: 200,
    totalReceived: 176.0,
  },
  {
    id: "12",
    ticker: "HGLG11",
    name: "CSHG Logística FII",
    date: "2023-10-12",
    value: 0.9,
    type: "dividend",
    quantity: 200,
    totalReceived: 180.0,
  },
  {
    id: "13",
    ticker: "HGLG11",
    name: "CSHG Logística FII",
    date: "2023-09-15",
    value: 0.85,
    type: "dividend",
    quantity: 200,
    totalReceived: 170.0,
  },
  {
    id: "14",
    ticker: "HGLG11",
    name: "CSHG Logística FII",
    date: "2023-08-10",
    value: 0.87,
    type: "dividend",
    quantity: 200,
    totalReceived: 174.0,
  },
]

type PeriodFilter = "30d" | "3m" | "6m" | "1y" | "all"

export function DividendsHistory() {
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>("6m")
  const [assetFilter, setAssetFilter] = useState<string>("all")

  const filteredDividends = useMemo(() => {
    let filtered = [...mockDividends]

    // Filter by period
    if (periodFilter !== "all") {
      const now = new Date()
      let cutoffDate: Date

      switch (periodFilter) {
        case "30d":
          cutoffDate = subDays(now, 30)
          break
        case "3m":
          cutoffDate = subMonths(now, 3)
          break
        case "6m":
          cutoffDate = subMonths(now, 6)
          break
        case "1y":
          cutoffDate = subMonths(now, 12)
          break
        default:
          cutoffDate = new Date(0)
      }

      filtered = filtered.filter((dividend) => isAfter(parseISO(dividend.date), cutoffDate))
    }

    // Filter by asset
    if (assetFilter !== "all") {
      filtered = filtered.filter((dividend) => dividend.ticker === assetFilter)
    }

    // Sort by date (most recent first)
    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [periodFilter, assetFilter])

  const monthlyResume = useMemo(() => {
    const resume = new Map<string, number>()

    filteredDividends.forEach((dividend) => {
      const monthKey = format(parseISO(dividend.date), "yyyy-MM")
      const current = resume.get(monthKey) || 0
      resume.set(monthKey, current + dividend.totalReceived)
    })

    return Array.from(resume.entries())
      .map(([month, total]) => ({
        month: format(parseISO(`${month}-01`), "MMM yyyy", { locale: ptBR }),
        total,
      }))
      .sort((a, b) => b.month.localeCompare(a.month))
      .slice(0, 6) // Show last 6 months
  }, [filteredDividends])

  const totalDividends = filteredDividends.reduce((sum, dividend) => sum + dividend.totalReceived, 0)
  const uniqueAssets = Array.from(new Set(mockDividends.map((d) => d.ticker)))

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Recebido</p>
                  <p className="text-2xl font-bold text-green-500">
                    {totalDividends.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <CalendarDays className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pagamentos</p>
                  <p className="text-2xl font-bold">{filteredDividends.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-teal-500" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Média Mensal</p>
                  <p className="text-2xl font-bold">
                    {monthlyResume.length > 0
                      ? (monthlyResume.reduce((sum, m) => sum + m.total, 0) / monthlyResume.length).toLocaleString(
                          "pt-BR",
                          { style: "currency", currency: "BRL" },
                        )
                      : "R$ 0,00"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Monthly Resume */}
      {monthlyResume.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Resumo Mensal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {monthlyResume.map((month, index) => (
                  <div key={month.month} className="text-center p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground capitalize">{month.month}</p>
                    <p className="text-lg font-semibold text-green-500">
                      {month.total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Filters and Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle>Histórico de Proventos</CardTitle>
              <div className="flex flex-col sm:flex-row gap-2">
                <Select value={periodFilter} onValueChange={(value: PeriodFilter) => setPeriodFilter(value)}>
                  <SelectTrigger className="w-full sm:w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30d">Últimos 30 dias</SelectItem>
                    <SelectItem value="3m">Últimos 3 meses</SelectItem>
                    <SelectItem value="6m">Últimos 6 meses</SelectItem>
                    <SelectItem value="1y">Último ano</SelectItem>
                    <SelectItem value="all">Todos</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={assetFilter} onValueChange={setAssetFilter}>
                  <SelectTrigger className="w-full sm:w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos ativos</SelectItem>
                    {uniqueAssets.map((ticker) => (
                      <SelectItem key={ticker} value={ticker}>
                        {ticker}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Data</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Ativo</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Tipo</th>
                    <th className="text-right py-3 px-2 font-medium text-muted-foreground">Valor/Cota</th>
                    <th className="text-right py-3 px-2 font-medium text-muted-foreground">Quantidade</th>
                    <th className="text-right py-3 px-2 font-medium text-muted-foreground">Total Recebido</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDividends.map((dividend, index) => (
                    <motion.tr
                      key={dividend.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="border-b hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-3 px-2">
                        <div className="text-sm">{format(parseISO(dividend.date), "dd/MM/yyyy")}</div>
                      </td>
                      <td className="py-3 px-2">
                        <div>
                          <div className="font-medium">{dividend.ticker}</div>
                          <div className="text-xs text-muted-foreground">{dividend.name}</div>
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <Badge variant="secondary">{dividend.type === "dividend" ? "Dividendo" : "JCP"}</Badge>
                      </td>
                      <td className="py-3 px-2 text-right">
                        {dividend.value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                      </td>
                      <td className="py-3 px-2 text-right">{dividend.quantity.toLocaleString("pt-BR")}</td>
                      <td className="py-3 px-2 text-right">
                        <span className="font-medium text-green-500">
                          {dividend.totalReceived.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              {filteredDividends.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum provento encontrado para os filtros selecionados.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
