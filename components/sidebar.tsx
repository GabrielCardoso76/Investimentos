import { BarChart3, PieChart, TrendingUp, Wallet, DollarSign, Settings, User } from "lucide-react"
import { Button } from "@/components/ui/button"

const navigation = [
  { name: "Visão Geral", icon: BarChart3, current: true },
  { name: "Carteira", icon: Wallet, current: false },
  { name: "Análise", icon: PieChart, current: false },
  { name: "Performance", icon: TrendingUp, current: false },
  { name: "Proventos", icon: DollarSign, current: false },
]

const secondaryNavigation = [
  { name: "Perfil", icon: User },
  { name: "Configurações", icon: Settings },
]

export function Sidebar() {
  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border">
      <div className="flex h-16 items-center px-6 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold text-sidebar-foreground">InvestPro</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => (
          <Button
            key={item.name}
            variant={item.current ? "default" : "ghost"}
            className={`w-full justify-start gap-3 ${
              item.current
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            }`}
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </Button>
        ))}

        <div className="pt-6 mt-6 border-t border-sidebar-border">
          {secondaryNavigation.map((item) => (
            <Button
              key={item.name}
              variant="ghost"
              className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Button>
          ))}
        </div>
      </nav>
    </div>
  )
}
