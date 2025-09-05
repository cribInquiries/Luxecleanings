"use client"

import { useState } from "react"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { CalendarView } from "@/components/calendar-view"
import { CleaningDashboard } from "@/components/cleaning-dashboard"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserMenu } from "@/components/user-menu"
import { Toaster } from "@/components/toaster"
import { DynamicIslandNav } from "@/components/dynamic-island-nav"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"

export default function Home() {
  const [currentView, setCurrentView] = useState("services")
  const [selectedService, setSelectedService] = useState<string | null>(null)

  const handleNavigate = (view: string) => {
    setCurrentView(view)
  }

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId)
    setCurrentView("calendar")
  }

  const getBreadcrumbs = () => {
    switch (currentView) {
      case "services":
        return [{ label: "Services", current: true }]
      case "calendar":
        return [
          { label: "Services", current: false },
          { label: "Calendar", current: true },
        ]
      default:
        return [{ label: "Services", current: true }]
    }
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case "calendar":
        return <CalendarView selectedProperty={selectedService} onNavigate={handleNavigate} />
      case "services":
      default:
        return <CleaningDashboard onServiceSelect={handleServiceSelect} />
    }
  }

  const breadcrumbs = getBreadcrumbs()

  return (
    <ProtectedRoute>
      <SidebarProvider>
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <AppSidebar
            activeView={currentView}
            onViewChange={handleNavigate}
            selectedProperty={selectedService}
            onPropertySelect={handleServiceSelect}
          />
        </div>

        <SidebarInset>
          {/* Header - responsive */}
          <header className="flex h-14 md:h-16 shrink-0 items-center gap-2 border-b px-4 safe-top">
            <SidebarTrigger className="-ml-1 md:hidden" />
            <Separator orientation="vertical" className="mr-2 h-4 hidden md:block" />

            {/* Breadcrumbs - hidden on mobile */}
            <div className="hidden sm:block">
              <Breadcrumb>
                <BreadcrumbList>
                  {breadcrumbs.map((crumb, index) => (
                    <div key={index} className="flex items-center">
                      {index > 0 && <BreadcrumbSeparator />}
                      <BreadcrumbItem>
                        {crumb.current ? (
                          <BreadcrumbPage className="text-sm md:text-base">{crumb.label}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault()
                                                          if (crumb.label === "Services") {
                              handleNavigate("services")
                            }
                            }}
                            className="text-sm md:text-base"
                          >
                            {crumb.label}
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                    </div>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            {/* Mobile title */}
            <div className="sm:hidden flex-1">
              <h1 className="text-lg font-semibold">{breadcrumbs[breadcrumbs.length - 1]?.label}</h1>
            </div>

            <div className="ml-auto">
              <UserMenu />
            </div>
          </header>

          {/* Main content with mobile padding */}
          <div className="flex-1 space-y-4 p-4 md:p-6 pb-20 md:pb-6 mobile-safe-area">{renderCurrentView()}</div>
        </SidebarInset>

        {/* Mobile Navigation */}
        <DynamicIslandNav
          activeView={currentView}
          onViewChange={handleNavigate}
          selectedProperty={selectedService}
          onPropertySelect={handleServiceSelect}
        />

        <Toaster />
      </SidebarProvider>
    </ProtectedRoute>
  )
}
