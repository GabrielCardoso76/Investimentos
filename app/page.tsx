import { DashboardLayout } from "@/components/dashboard-layout"
import { PortfolioSummary } from "@/components/portfolio-summary"
import { AssetAllocationChart } from "@/components/asset-allocation-chart"
import { PerformanceChart } from "@/components/performance-chart"
import { AssetCard } from "@/components/asset-card"
import { AssetsTable } from "@/components/assets-table"
import { DividendsHistory } from "@/components/dividends-history"

// Mock data for assets
const mockAssets = [
  {
    id: "PETR4",
    ticker: "PETR4",
    name: "Petrobras PN",
    type: "stock" as const,
    currentPrice: 32.8,
    returnPercentage: 15.09,
    currentValue: 16400.0,
    sector: "Energia",
  },
  {
    id: "ITSA4",
    ticker: "ITSA4",
    name: "Itaúsa PN",
    type: "stock" as const,
    currentPrice: 11.25,
    returnPercentage: 14.8,
    currentValue: 11250.0,
    sector: "Financeiro",
  },
  {
    id: "HGLG11",
    ticker: "HGLG11",
    name: "CSHG Logística FII",
    type: "fii" as const,
    currentPrice: 102.5,
    returnPercentage: 7.89,
    currentValue: 20500.0,
    sector: "Logística",
  },
]

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6 lg:space-y-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-balance">Meu Portfólio</h1>
          <p className="text-muted-foreground mt-2 text-sm lg:text-base">
            Acompanhe seus investimentos e performance em tempo real
          </p>
        </div>

        <PortfolioSummary />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
          <AssetAllocationChart />
          <PerformanceChart />
        </div>

        <div>
          <h2 className="text-xl lg:text-2xl font-semibold mb-4">Ativos Individuais</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 lg:gap-4">
            {mockAssets.map((asset, index) => (
              <AssetCard key={asset.id} asset={asset} index={index} />
            ))}
          </div>
        </div>

        <AssetsTable />
        <DividendsHistory />
      </div>
    </DashboardLayout>
  )
}
