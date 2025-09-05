"use client"

import { Building2, Calendar, Home, Building, Sparkles } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

interface AppSidebarProps {
  activeView: string
  onViewChange: (view: string) => void
  selectedProperty: string | null
  onPropertySelect: (propertyId: string) => void
}

const mockServices = [
  { id: "1", name: "Luxury Residential", location: "Beverly Hills, CA", type: "residential" },
  { id: "2", name: "Commercial Office", location: "Downtown LA, CA", type: "commercial" },
  { id: "3", name: "Deep Cleaning", location: "Malibu, CA", type: "deep" },
]

export function AppSidebar({ activeView, onViewChange, selectedProperty, onPropertySelect }: AppSidebarProps) {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => onViewChange("services")} isActive={activeView === "services"}>
                  <Building2 />
                  <span>Services</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Services</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mockServices.map((service) => {
                const getServiceIcon = (type: string) => {
                  switch (type) {
                    case "residential":
                      return Home
                    case "commercial":
                      return Building
                    case "deep":
                      return Sparkles
                    default:
                      return Home
                  }
                }
                const ServiceIcon = getServiceIcon(service.type)
                return (
                  <SidebarMenuItem key={service.id}>
                    <SidebarMenuButton
                      onClick={() => onPropertySelect(service.id)}
                      isActive={selectedProperty === service.id && activeView === "calendar"}
                    >
                      <ServiceIcon />
                      <span>{service.name}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
