"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
  LayoutDashboard, 
  Server, 
  Users, 
  ChevronLeft, 
  ChevronRight,
  Settings
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Sistemas", href: "/sistemas", icon: Server },
  { name: "Clientes", href: "/clientes", icon: Users },
]

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <motion.aside
      initial={{ width: 256 }}
      animate={{ width: isCollapsed ? 80 : 256 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="relative z-20 flex flex-col h-screen border-r border-white/5 bg-zinc-950/50 backdrop-blur-xl"
    >
      <div className="flex items-center justify-between p-4 h-20">
        <AnimatePresence mode="popLayout">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-center gap-3 overflow-hidden"
            >
              <div className="relative h-10 w-10 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
                <span className="text-white font-bold text-lg tracking-tighter">NS</span>
                <div className="absolute inset-0 rounded-xl ring-1 ring-white/20" />
              </div>
              <span className="text-zinc-100 font-bold text-xl tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
                NicoSys
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {isCollapsed && (
          <div className="mx-auto relative h-10 w-10 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <span className="text-white font-bold text-lg tracking-tighter">NS</span>
          </div>
        )}
      </div>

      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-24 z-30 flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors shadow-xl"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <nav className="flex-1 space-y-2 p-3 mt-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          
          return (
            <Link key={item.name} href={item.href} className="relative block">
              {isActive && (
                <motion.div
                  layoutId="active-nav"
                  className="absolute inset-0 rounded-xl bg-white/5 border border-white/10"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              
              <div className={cn(
                "relative flex items-center gap-3 rounded-xl px-3 py-3 transition-colors",
                isActive ? "text-violet-400" : "text-zinc-400 hover:text-zinc-100 hover:bg-white/5"
              )}>
                <item.icon size={20} className={cn("shrink-0", isActive && "drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]")} />
                <AnimatePresence mode="popLayout">
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      className="font-medium whitespace-nowrap overflow-hidden text-sm"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </Link>
          )
        })}
      </nav>

      <div className="p-3 mb-4">
        <button className={cn(
          "w-full flex items-center gap-3 rounded-xl px-3 py-3 text-zinc-400 hover:text-zinc-100 hover:bg-white/5 transition-colors",
          isCollapsed && "justify-center"
        )}>
          <Settings size={20} className="shrink-0" />
          {!isCollapsed && <span className="font-medium text-sm">Configuración</span>}
        </button>
      </div>
    </motion.aside>
  )
}
