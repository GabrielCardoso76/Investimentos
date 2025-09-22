"use client"

import type { ReactNode } from "react"
import { Sidebar } from "./sidebar"
import { MobileSidebar } from "./mobile-sidebar"

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <div className="lg:hidden">
        <MobileSidebar />
      </div>

      <main className="flex-1 p-4 lg:p-8">{children}</main>
    </div>
  )
}
