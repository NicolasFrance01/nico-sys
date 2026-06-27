import { prisma } from "@/lib/prisma"
import { SystemType } from "@prisma/client"
import { Server, Grid, Users, Boxes } from "lucide-react"

export default async function DashboardPage() {
  const [total, propios, clientes, algeiba] = await Promise.all([
    prisma.system.count(),
    prisma.system.count({ where: { type: SystemType.PROPIO } }),
    prisma.system.count({ where: { type: SystemType.CLIENTE } }),
    prisma.system.count({ where: { type: SystemType.ALGEIBA } })
  ])

  const stats = [
    { title: "Total Sistemas", value: total, icon: Grid, color: "from-blue-500 to-cyan-500" },
    { title: "Sistemas Propios", value: propios, icon: Server, color: "from-violet-500 to-fuchsia-500" },
    { title: "Sistemas Clientes", value: clientes, icon: Users, color: "from-emerald-500 to-teal-500" },
    { title: "Sistemas Algeiba", value: algeiba, icon: Boxes, color: "from-orange-500 to-rose-500" },
  ]

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-100">Visión General</h1>
        <p className="mt-2 text-zinc-400">
          Bienvenido de nuevo. Aquí tienes el estado actual de tu ecosistema.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <div 
            key={i} 
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/40 p-6 backdrop-blur-xl transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-violet-500/10"
          >
            <div className={`absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br ${stat.color} opacity-20 blur-3xl transition-opacity group-hover:opacity-40`} />
            
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-zinc-400">{stat.title}</p>
              <div className="rounded-lg bg-white/5 p-2 text-zinc-300 ring-1 ring-white/10 transition-colors group-hover:bg-white/10">
                <stat.icon size={20} />
              </div>
            </div>
            
            <div className="mt-6 flex items-baseline gap-2">
              <p className="text-4xl font-bold tracking-tight text-white">{stat.value}</p>
            </div>
            
            {/* Pequeña barra decorativa inferior */}
            <div className="absolute bottom-0 left-0 h-1 w-full bg-white/5">
              <div className={`h-full w-2/3 bg-gradient-to-r ${stat.color} opacity-50`} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Placeholder para gráfico/tabla principal */}
        <div className="col-span-4 rounded-2xl border border-white/10 bg-zinc-900/40 backdrop-blur-xl p-8 shadow-xl min-h-[400px] flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(139,92,246,0.1),transparent_50%)]" />
          <div className="text-center space-y-3 relative z-10">
            <div className="mx-auto w-12 h-12 rounded-full bg-white/5 flex items-center justify-center ring-1 ring-white/10">
              <Server className="text-zinc-500" />
            </div>
            <h3 className="text-lg font-medium text-zinc-200">Actividad de Sistemas</h3>
            <p className="text-sm text-zinc-500 max-w-xs mx-auto">El gráfico de métricas se integrará próximamente en esta sección.</p>
          </div>
        </div>

        {/* Placeholder para próximos vencimientos */}
        <div className="col-span-3 rounded-2xl border border-white/10 bg-zinc-900/40 backdrop-blur-xl p-8 shadow-xl flex items-center justify-center">
           <div className="text-center space-y-3">
            <div className="mx-auto w-12 h-12 rounded-full bg-white/5 flex items-center justify-center ring-1 ring-white/10">
              <Users className="text-zinc-500" />
            </div>
            <h3 className="text-lg font-medium text-zinc-200">Próximos Cobros</h3>
            <p className="text-sm text-zinc-500 max-w-xs mx-auto">La lista de alertas amarillas y rojas aparecerá aquí.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
