"use client"

import { useState } from "react"
import { BarChart3, PieChart, TrendingUp, Wallet, DollarSign, Settings, User, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

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

export function MobileSidebar() {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex items-center justify-between p-4 border-b border-border bg-background">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-primary-foreground" />
        </div>
        <span className="text-lg font-semibold">InvestPro</span>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex h-16 items-center justify-between px-6 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold">InvestPro</span>
            </div>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => (
              <Button
                key={item.name}
                variant={item.current ? "default" : "ghost"}
                className="w-full justify-start gap-3"
                onClick={() => setOpen(false)}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Button>
            ))}

            <div className="pt-6 mt-6 border-t border-border">
              {secondaryNavigation.map((item) => (
                <Button
                  key={item.name}
                  variant="ghost"
                  className="w-full justify-start gap-3"
                  onClick={() => setOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Button>
              ))}
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  )
}
