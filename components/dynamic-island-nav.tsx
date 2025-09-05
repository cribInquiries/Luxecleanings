"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Home,
  Settings,
  Building2,
  CalendarDays,
  Link2,
  Plus,
  Bell,
  Search,
  Map,
  Navigation,
  Download,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface DynamicIslandNavProps {
  activeView: string
  onViewChange: (view: string) => void
  selectedProperty: string | null
  onPropertySelect?: (propertyId: string) => void
}

const navItems = [
  { id: "dashboard", icon: Home, label: "Dashboard" },
  { id: "global-calendar", icon: CalendarDays, label: "Calendar" },
  { id: "map-view", icon: Map, label: "Map" },
  { id: "navigation", icon: Navigation, label: "Navigation" },
  { id: "properties", icon: Building2, label: "Properties" },
  { id: "ical-feeds", icon: Link2, label: "iCal" },
  { id: "location-search", icon: Search, label: "Search" },
  { id: "offline-maps", icon: Download, label: "Offline" },
  { id: "settings", icon: Settings, label: "Settings" },
]

export function DynamicIslandNav({ activeView, onViewChange }: DynamicIslandNavProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [notifications] = useState(2)

  const activeItem = navItems.find((item) => item.id === activeView)

  const handleToggle = () => {
    setIsExpanded(!isExpanded)
  }

  const handleNavigation = (view: string) => {
    onViewChange(view)
    setIsExpanded(false)
  }

  return (
    <>
      {/* Dynamic Island */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 md:hidden">
        <motion.div
          layout
          initial={false}
          animate={{
            width: isExpanded ? "320px" : "140px",
            height: isExpanded ? "280px" : "36px",
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 35,
          }}
          className="relative"
        >
          <motion.div
            layout
            className="relative w-full h-full bg-black/80 backdrop-blur-2xl rounded-full shadow-2xl border border-white/10 overflow-hidden"
            style={{
              backdropFilter: "blur(20px) saturate(180%)",
            }}
          >
            {/* Collapsed State */}
            <AnimatePresence>
              {!isExpanded && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  onClick={handleToggle}
                  className="flex items-center justify-center w-full h-full px-4 text-white/90 hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {activeItem && (
                      <div className="p-1 rounded-full bg-white/20">
                        <activeItem.icon className="h-3.5 w-3.5" />
                      </div>
                    )}
                    <span className="text-sm font-medium">{activeItem?.label}</span>
                  </div>
                  {notifications > 0 && (
                    <div className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-bold">{notifications}</span>
                    </div>
                  )}
                </motion.button>
              )}
            </AnimatePresence>

            {/* Expanded State */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, delay: 0.05 }}
                  className="p-6 h-full flex flex-col"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-white font-semibold text-lg">PropertySync</h3>
                      <p className="text-white/60 text-sm">Navigate</p>
                    </div>
                    <button
                      onClick={handleToggle}
                      className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      <Plus className="h-4 w-4 text-white rotate-45" />
                    </button>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex gap-2 mb-6">
                    <Button
                      size="sm"
                      className="flex-1 bg-white/10 hover:bg-white/20 text-white border-0 rounded-full h-8"
                    >
                      <Plus className="h-3.5 w-3.5 mr-1.5" />
                      Add
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 bg-white/10 hover:bg-white/20 text-white border-0 rounded-full h-8"
                    >
                      <Search className="h-3.5 w-3.5 mr-1.5" />
                      Search
                    </Button>
                    <Button
                      size="sm"
                      className="relative bg-white/10 hover:bg-white/20 text-white border-0 rounded-full h-8 w-8 p-0"
                    >
                      <Bell className="h-3.5 w-3.5" />
                      {notifications > 0 && (
                        <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></div>
                      )}
                    </Button>
                  </div>

                  {/* Navigation Grid */}
                  <div className="grid grid-cols-2 gap-3 flex-1">
                    {navItems.map((item) => (
                      <motion.button
                        key={item.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleNavigation(item.id)}
                        className={`p-4 rounded-2xl transition-all duration-200 flex flex-col items-center gap-2 ${
                          activeView === item.id ? "bg-white/20 shadow-lg" : "bg-white/5 hover:bg-white/10"
                        }`}
                      >
                        <div className={`p-2 rounded-xl ${activeView === item.id ? "bg-white/20" : "bg-white/10"}`}>
                          <item.icon className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-white text-xs font-medium">{item.label}</span>
                      </motion.button>
                    ))}
                  </div>

                  {/* Status */}
                  <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-white/10">
                    <div className="h-1.5 w-1.5 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-white/60 text-xs">All systems operational</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>

      {/* Backdrop */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsExpanded(false)}
            className="fixed inset-0 bg-black/10 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Bottom Navigation */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 md:hidden">
        <div className="bg-black/80 backdrop-blur-lg rounded-full px-4 py-2 flex items-center gap-2">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              onClick={() => handleNavigation(item.id)}
              className={`rounded-full h-10 w-10 p-0 ${
                activeView === item.id ? "bg-white/20 text-white" : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <item.icon className="h-5 w-5" />
            </Button>
          ))}
        </div>
      </div>
    </>
  )
}
