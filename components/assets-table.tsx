"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowUpDown, ArrowUp, ArrowDown, Filter } from "lucide-react"

// Mock data for portfolio assets
const mockAssets = [
  {
    id: "PETR4",
    ticker: "PETR4",
    name: "Petrobras PN",
    type: "stock" as const,
    quantity: 500,
    averagePrice: 28.5,
    currentPrice: 32.8,
    totalInvested: 14250.0,
    currentValue: 16400.0,
    return: 2150.0,
    returnPercentage: 15.09,
    sector: "Energia",
  },
  {
    id: "ITSA4",
    ticker: "ITSA4",
    name: "Itaúsa PN",
    type: "stock" as const,
    quantity: 1000,
    averagePrice: 9.8,
    currentPrice: 11.25,
    totalInvested: 9800.0,
    currentValue: 11250.0,
    return: 1450.0,
    returnPercentage: 14.8,
    sector: "Financeiro",
  },
  {
    id: "HGLG11",
    ticker: "HGLG11",
    name: "CSHG Logística FII",
    type: "fii" as const,
    quantity: 200,
    averagePrice: 95.0,
    currentPrice: 102.5,
    totalInvested: 19000.0,
    currentValue: 20500.0,
    return: 1500.0,
    returnPercentage: 7.89,
    sector: "Logística",
  },
  {
    id: "VALE3",
    ticker: "VALE3",
    name: "Vale ON",
    type: "stock" as const,
    quantity: 300,
    averagePrice: 65.2,
    currentPrice: 71.8,
    totalInvested: 19560.0,
    currentValue: 21540.0,
    return: 1980.0,
    returnPercentage: 10.12,
    sector: "Mineração",
  },
  {
    id: "XPLG11",
    ticker: "XPLG11",
    name: "XP Log FII",
    type: "fii" as const,
    quantity: 150,
    averagePrice: 98.5,
    currentPrice: 105.2,
    totalInvested: 14775.0,
    currentValue: 15780.0,
    return: 1005.0,
    returnPercentage: 6.8,
    sector: "Logística",
  },
]

type SortField = "ticker" | "currentValue" | "returnPercentage" | "quantity"
type SortDirection = "asc" | "desc"
type AssetType = "all" | "stock" | "fii"

export function AssetsTable() {
  const [sortField, setSortField] = useState<SortField>("currentValue")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [filterType, setFilterType] = useState<AssetType>("all")

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const filteredAndSortedAssets = useMemo(() => {
    let filtered = mockAssets

    if (filterType !== "all") {
      filtered = mockAssets.filter((asset) => asset.type === filterType)
    }

    return filtered.sort((a, b) => {
      let aValue: number | string
      let bValue: number | string

      switch (sortField) {
        case "ticker":
          aValue = a.ticker
          bValue = b.ticker
          break
        case "currentValue":
          aValue = a.currentValue
          bValue = b.currentValue
          break
        case "returnPercentage":
          aValue = a.returnPercentage
          bValue = b.returnPercentage
          break
        case "quantity":
          aValue = a.quantity
          bValue = b.quantity
          break
        default:
          return 0
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue
      }

      return 0
    })
  }, [sortField, sortDirection, filterType])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4" />
    }
    return sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Meus Ativos</CardTitle>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <div className="flex gap-1">
                <Button
                  variant={filterType === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType("all")}
                >
                  Todos
                </Button>
                <Button
                  variant={filterType === "stock" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType("stock")}
                >
                  Ações
                </Button>
                <Button
                  variant={filterType === "fii" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType("fii")}
                >
                  FIIs
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 font-semibold"
                      onClick={() => handleSort("ticker")}
                    >
                      Ativo
                      {getSortIcon("ticker")}
                    </Button>
                  </TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 font-semibold"
                      onClick={() => handleSort("quantity")}
                    >
                      Qtd
                      {getSortIcon("quantity")}
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">Preço Médio</TableHead>
                  <TableHead className="text-right">Preço Atual</TableHead>
                  <TableHead className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 font-semibold"
                      onClick={() => handleSort("currentValue")}
                    >
                      Valor Total
                      {getSortIcon("currentValue")}
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 font-semibold"
                      onClick={() => handleSort("returnPercentage")}
                    >
                      Rentabilidade
                      {getSortIcon("returnPercentage")}
                    </Button>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedAssets.map((asset, index) => (
                  <motion.tr
                    key={asset.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="group hover:bg-muted/50 transition-colors"
                  >
                    <TableCell>
                      <div>
                        <div className="font-semibold">{asset.ticker}</div>
                        <div className="text-sm text-muted-foreground">{asset.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={asset.type === "stock" ? "default" : "secondary"}>
                        {asset.type === "stock" ? "Ação" : "FII"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono">{asset.quantity.toLocaleString("pt-BR")}</TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(asset.averagePrice)}</TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(asset.currentPrice)}</TableCell>
                    <TableCell className="text-right font-mono font-semibold">
                      {formatCurrency(asset.currentValue)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-col items-end">
                        <span
                          className={`font-mono font-semibold ${
                            asset.returnPercentage >= 0 ? "text-emerald-600" : "text-red-500"
                          }`}
                        >
                          {formatPercentage(asset.returnPercentage)}
                        </span>
                        <span
                          className={`text-sm font-mono ${asset.return >= 0 ? "text-emerald-600" : "text-red-500"}`}
                        >
                          {formatCurrency(asset.return)}
                        </span>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
