"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { useGetDividends } from "@/hooks/use-portfolio-data"
import { format, parseISO, isAfter, subDays, subMonths } from "date-fns"
import { DollarSign, CalendarDays } from "lucide-react"

type Dividend = {
  date: string;
  ticker: string;
  value: number;
};

type PeriodFilter = "30d" | "3m" | "6m" | "1y" | "all";

export function DividendsHistory() {
  const { data: dividends, isLoading, isError, error } = useGetDividends();
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>("all");
  const [assetFilter, setAssetFilter] = useState<string>("all");

  const filteredDividends = useMemo(() => {
    if (!dividends) return [];

    let filtered: Dividend[] = [...dividends];

    // Filter by period
    if (periodFilter !== "all") {
      const now = new Date();
      let cutoffDate: Date;
      switch (periodFilter) {
        case "30d": cutoffDate = subDays(now, 30); break;
        case "3m": cutoffDate = subMonths(now, 3); break;
        case "6m": cutoffDate = subMonths(now, 6); break;
        case "1y": cutoffDate = subMonths(now, 12); break;
        default: cutoffDate = new Date(0);
      }
      filtered = filtered.filter((d: Dividend) => isAfter(parseISO(d.date), cutoffDate));
    }

    // Filter by asset
    if (assetFilter !== "all") {
      filtered = filtered.filter((d: Dividend) => d.ticker === assetFilter);
    }

    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [periodFilter, assetFilter, dividends]);

  const summary = useMemo(() => {
    if (!filteredDividends) return { total: 0, count: 0 };
    return {
      total: filteredDividends.reduce((sum, d) => sum + d.value, 0),
      count: filteredDividends.length,
    };
  }, [filteredDividends]);

  const uniqueAssets = useMemo(() => {
    if (!dividends) return [];
    return Array.from(new Set(dividends.map((d: Dividend) => d.ticker)));
  }, [dividends]);

  const formatCurrency = (value: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
  const formatDate = (dateString: string) => format(parseISO(dateString), "dd/MM/yyyy");

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
        <Card>
          <CardHeader><Skeleton className="h-8 w-48" /></CardHeader>
          <CardContent><Skeleton className="h-40 w-full" /></CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return <div className="text-red-500 bg-red-100 p-4 rounded-md">Erro ao carregar histórico de proventos: {error.message}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card><CardContent className="p-6 flex items-center space-x-4">
            <DollarSign className="h-6 w-6 text-green-500" />
            <div>
                <p className="text-sm font-medium text-muted-foreground">Total Recebido</p>
                <p className="text-2xl font-bold">{formatCurrency(summary.total)}</p>
            </div>
        </CardContent></Card>
        <Card><CardContent className="p-6 flex items-center space-x-4">
            <CalendarDays className="h-6 w-6 text-blue-500" />
            <div>
                <p className="text-sm font-medium text-muted-foreground">Pagamentos no Período</p>
                <p className="text-2xl font-bold">{summary.count}</p>
            </div>
        </CardContent></Card>
      </div>

      {/* Filters and Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle>Histórico de Proventos</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={periodFilter} onValueChange={(v) => setPeriodFilter(v as PeriodFilter)}>
                <SelectTrigger className="w-full sm:w-[140px]"><SelectValue placeholder="Período" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todo o período</SelectItem>
                  <SelectItem value="30d">Últimos 30 dias</SelectItem>
                  <SelectItem value="3m">Últimos 3 meses</SelectItem>
                  <SelectItem value="6m">Últimos 6 meses</SelectItem>
                  <SelectItem value="1y">Último ano</SelectItem>
                </SelectContent>
              </Select>
              <Select value={assetFilter} onValueChange={setAssetFilter}>
                <SelectTrigger className="w-full sm:w-[120px]"><SelectValue placeholder="Ativo" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos ativos</SelectItem>
                  {uniqueAssets.map((ticker) => <SelectItem key={ticker} value={ticker}>{ticker}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Ativo</TableHead>
                  <TableHead className="text-right">Valor Recebido</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDividends.length > 0 ? (
                  filteredDividends.map((dividend, index) => (
                    <TableRow key={`${dividend.ticker}-${dividend.date}-${index}`}>
                      <TableCell>{formatDate(dividend.date)}</TableCell>
                      <TableCell className="font-medium">{dividend.ticker}</TableCell>
                      <TableCell className="text-right font-mono text-emerald-600">{formatCurrency(dividend.value)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground py-8">Nenhum provento encontrado para os filtros selecionados.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
