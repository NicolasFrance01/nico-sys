"use client"

import { Bell, Search } from "lucide-react"

export function Header({ userName }: { userName: string }) {
  return (
    <header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b border-white/5 bg-zinc-950/60 px-8 backdrop-blur-md">
      <div className="flex items-center gap-4 w-96">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input 
            type="text" 
            placeholder="Buscar sistemas o clientes..." 
            className="w-full rounded-full border border-white/5 bg-white/5 py-2 pl-10 pr-4 text-sm text-zinc-200 placeholder:text-zinc-500 focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/50 transition-all"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <button className="relative text-zinc-400 hover:text-zinc-100 transition-colors">
          <Bell size={20} />
          <span className="absolute 0 right-0 top-0 block h-2 w-2 rounded-full bg-violet-500 ring-2 ring-zinc-950" />
        </button>

        <div className="flex items-center gap-3 pl-6 border-l border-white/10">
          <div className="flex flex-col items-end">
            <span className="text-sm font-medium text-zinc-200">{userName}</span>
            <span className="text-xs text-zinc-500">Administrador</span>
          </div>
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 p-[2px]">
            <div className="h-full w-full rounded-full bg-zinc-950 flex items-center justify-center">
              <span className="text-xs font-bold text-violet-400 uppercase">
                {userName.slice(0, 2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
