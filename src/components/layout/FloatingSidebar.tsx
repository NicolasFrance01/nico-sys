"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { 
  LayoutGrid, 
  Layers, 
  UsersRound, 
  Settings2,
  LogOut
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { name: "Visión", href: "/", icon: LayoutGrid },
  { name: "Ecosistema", href: "/sistemas", icon: Layers },
  { name: "Directorio", href: "/clientes", icon: UsersRound },
]

export function FloatingSidebar({ userName }: { userName: string }) {
  const pathname = usePathname()

  return (
    <nav className="fixed left-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-8 rounded-[2rem] bg-zinc-950/40 p-4 backdrop-blur-2xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] shadow-violet-500/10">
      
      {/* Brand Icon */}
      <div className="relative group cursor-pointer flex justify-center">
        <div className="absolute inset-0 bg-violet-500/20 rounded-full blur-xl group-hover:bg-violet-500/40 transition-all duration-500" />
        <div className="relative h-12 w-12 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center border border-white/20">
          <span className="text-white font-black text-xl tracking-tighter">NS</span>
        </div>
      </div>

      {/* Nav Links */}
      <div className="flex flex-col gap-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.name} href={item.href} className="group relative">
              <div className="flex h-12 w-12 items-center justify-center">
                {isActive && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 rounded-2xl bg-white/10 border border-white/20 shadow-lg"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon 
                  strokeWidth={isActive ? 2.5 : 1.5}
                  className={cn(
                    "relative z-10 transition-colors duration-300",
                    isActive ? "text-violet-300" : "text-zinc-500 group-hover:text-zinc-300"
                  )} 
                  size={24} 
                />
              </div>
              
              {/* Tooltip Hover */}
              <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-white/10 text-zinc-200 text-sm font-medium opacity-0 -translate-x-4 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 shadow-xl whitespace-nowrap z-50">
                {item.name}
              </div>
            </Link>
          )
        })}
      </div>

      <div className="w-8 h-[1px] bg-white/10 mx-auto my-2" />

      {/* Bottom Actions */}
      <div className="flex flex-col gap-4">
        <Link href="/perfil" className="group relative flex h-12 w-12 items-center justify-center">
          <Settings2 strokeWidth={1.5} className="text-zinc-500 group-hover:text-zinc-300 transition-colors" size={24} />
          <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-white/10 text-zinc-200 text-sm font-medium opacity-0 -translate-x-4 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 shadow-xl whitespace-nowrap z-50">
            Mi Perfil
          </div>
        </Link>
        
        <Link href="/perfil" className="group relative flex justify-center cursor-pointer mt-2">
          <div className="h-10 w-10 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center overflow-hidden hover:ring-2 hover:ring-violet-500/50 transition-all">
            <span className="text-xs font-bold text-zinc-400 uppercase group-hover:text-violet-400 transition-colors">
              {userName.slice(0, 2)}
            </span>
          </div>
          <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-white/10 text-zinc-200 text-sm font-medium opacity-0 -translate-x-4 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 shadow-xl whitespace-nowrap z-50 flex items-center gap-3">
            <span>{userName}</span>
            <LogOut size={14} className="text-red-400 hover:text-red-300" onClick={(e) => { e.preventDefault(); /* todo logout */ }} />
          </div>
        </Link>
      </div>

    </nav>
  )
}
