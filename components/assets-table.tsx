"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { useGetAssets } from "@/hooks/use-portfolio-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowUpDown, ArrowUp, ArrowDown, Filter } from "lucide-react"

type Asset = {
  id: string;
  ticker: string;
  name: string;
  type: 'stock' | 'fii';
  currentPrice: number;
  returnPercentage: number;
  currentValue: number;
};

type SortField = "ticker" | "currentValue" | "returnPercentage";
type SortDirection = "asc" | "desc";
type AssetTypeFilter = "all" | "stock" | "fii";

export function AssetsTable() {
  const { data: assets, isLoading, isError, error } = useGetAssets();
  const [sortField, setSortField] = useState<SortField>("currentValue");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [filterType, setFilterType] = useState<AssetTypeFilter>("all");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const filteredAndSortedAssets = useMemo(() => {
    if (!assets) return [];
    const filtered = assets.filter((asset: Asset) => filterType === 'all' || asset.type === filterType);
    return [...filtered].sort((a: Asset, b: Asset) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }
      return 0;
    });
  }, [sortField, sortDirection, filterType, assets]);

  const formatCurrency = (value: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
  const formatPercentage = (value: number) => `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4 ml-2" />;
    return sortDirection === "asc" ? <ArrowUp className="h-4 w-4 ml-2" /> : <ArrowDown className="h-4 w-4 ml-2" />;
  };

  const renderTableContent = () => {
    if (isLoading) {
      return (
        <TableBody>
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell className="py-4"><Skeleton className="h-5 w-24" /></TableCell>
              <TableCell><Skeleton className="h-5 w-16" /></TableCell>
              <TableCell className="text-right"><Skeleton className="h-5 w-12 ml-auto" /></TableCell>
              <TableCell className="text-right"><Skeleton className="h-5 w-20 ml-auto" /></TableCell>
              <TableCell className="text-right"><Skeleton className="h-5 w-20 ml-auto" /></TableCell>
              <TableCell className="text-right"><Skeleton className="h-5 w-24 ml-auto" /></TableCell>
              <TableCell className="text-right"><Skeleton className="h-5 w-20 ml-auto" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      );
    }

    if (isError) {
      return (
        <TableBody>
          <TableRow>
            <TableCell colSpan={7} className="text-center text-red-500 py-8">Erro ao carregar ativos: {error.message}</TableCell>
          </TableRow>
        </TableBody>
      );
    }

    if (filteredAndSortedAssets.length === 0) {
      return (
        <TableBody>
          <TableRow>
            <TableCell colSpan={7} className="text-center text-muted-foreground py-8">Nenhum ativo encontrado.</TableCell>
          </TableRow>
        </TableBody>
      );
    }

    return (
      <TableBody>
        {filteredAndSortedAssets.map((asset: Asset) => (
          <motion.tr key={asset.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <TableCell>
              <div className="font-semibold">{asset.ticker}</div>
              <div className="text-sm text-muted-foreground">{asset.name}</div>
            </TableCell>
            <TableCell><Badge variant={asset.type === "stock" ? "default" : "secondary"}>{asset.type.toUpperCase()}</Badge></TableCell>
            <TableCell className="text-right font-mono">-</TableCell> {/* Quantity Placeholder */}
            <TableCell className="text-right font-mono">-</TableCell> {/* Average Price Placeholder */}
            <TableCell className="text-right font-mono">{formatCurrency(asset.currentPrice)}</TableCell>
            <TableCell className="text-right font-mono font-semibold">{formatCurrency(asset.currentValue)}</TableCell>
            <TableCell className="text-right">
              <span className={`font-mono font-semibold ${asset.returnPercentage >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                {formatPercentage(asset.returnPercentage)}
              </span>
            </TableCell>
          </motion.tr>
        ))}
      </TableBody>
    );
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Meus Ativos</CardTitle>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <div className="flex gap-1">
                <Button variant={filterType === "all" ? "default" : "outline"} size="sm" onClick={() => setFilterType("all")}>Todos</Button>
                <Button variant={filterType === "stock" ? "default" : "outline"} size="sm" onClick={() => setFilterType("stock")}>Ações</Button>
                <Button variant={filterType === "fii" ? "default" : "outline"} size="sm" onClick={() => setFilterType("fii")}>FIIs</Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("ticker")}><div className="flex items-center">Ativo {getSortIcon("ticker")}</div></TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-right">Qtd</TableHead>
                  <TableHead className="text-right">Preço Médio</TableHead>
                  <TableHead className="text-right">Preço Atual</TableHead>
                  <TableHead className="text-right cursor-pointer" onClick={() => handleSort("currentValue")}><div className="flex items-center justify-end">Valor Total {getSortIcon("currentValue")}</div></TableHead>
                  <TableHead className="text-right cursor-pointer" onClick={() => handleSort("returnPercentage")}><div className="flex items-center justify-end">Rentabilidade {getSortIcon("returnPercentage")}</div></TableHead>
                </TableRow>
              </TableHeader>
              {renderTableContent()}
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
