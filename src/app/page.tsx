import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { SystemType } from "@prisma/client"
import { LucideLayoutDashboard, LucideServer, LucideUsers } from "lucide-react"

export default async function DashboardPage() {
  const session = await auth()
  
  if (!session) {
    redirect('/login')
  }

  // Fetch actual data from DB
  const [total, propios, clientes, algeiba] = await Promise.all([
    prisma.system.count(),
    prisma.system.count({ where: { type: SystemType.PROPIO } }),
    prisma.system.count({ where: { type: SystemType.CLIENTE } }),
    prisma.system.count({ where: { type: SystemType.ALGEIBA } })
  ])

  return (
    <div className="flex h-screen bg-zinc-950">
      {/* Sidebar Placeholder */}
      <aside className="w-64 border-r border-zinc-900 bg-zinc-950 flex flex-col p-4">
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="h-8 w-8 rounded bg-zinc-800 flex items-center justify-center">
            <span className="text-zinc-100 font-bold text-sm">NS</span>
          </div>
          <span className="text-zinc-100 font-semibold tracking-wide">NicoSys</span>
        </div>
        <nav className="flex-1 space-y-1">
          <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md bg-zinc-900 text-zinc-100 text-sm font-medium">
            <LucideLayoutDashboard size={18} /> Dashboard
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-100 text-sm font-medium transition-colors">
            <LucideServer size={18} /> Sistemas
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-100 text-sm font-medium transition-colors">
            <LucideUsers size={18} /> Clientes
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="h-14 border-b border-zinc-900 px-6 flex items-center justify-between sticky top-0 bg-zinc-950/80 backdrop-blur-md z-10">
          <h1 className="text-sm font-medium text-zinc-100">Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-xs text-zinc-500">{session.user?.name}</span>
            <div className="h-8 w-8 rounded-full bg-zinc-800 border border-zinc-700" />
          </div>
        </header>
        
        <div className="p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Total Sistemas", value: total },
              { title: "Sistemas Propios", value: propios },
              { title: "Sistemas Clientes", value: clientes },
              { title: "Sistemas Algeiba", value: algeiba },
            ].map((stat, i) => (
              <div key={i} className="rounded-xl border border-zinc-900 bg-zinc-900/20 p-6 flex flex-col justify-between">
                <p className="text-sm font-medium text-zinc-400">{stat.title}</p>
                <p className="mt-2 text-3xl font-semibold tracking-tight text-zinc-100">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
