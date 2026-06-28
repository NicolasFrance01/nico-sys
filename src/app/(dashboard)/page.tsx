import { prisma } from "@/lib/prisma"
import { SystemType } from "@prisma/client"
import { Server, Grid, Users, ArrowUpRight, ShieldCheck, Wallet } from "lucide-react"
import Link from "next/link"

export const revalidate = 0

export default async function DashboardPage() {
  const [total, propios, clientes, algeiba, ultimosSistemas, ultimosPagos] = await Promise.all([
    prisma.system.count(),
    prisma.system.count({ where: { type: SystemType.PROPIO } }),
    prisma.system.count({ where: { type: SystemType.CLIENTE } }),
    prisma.system.count({ where: { type: SystemType.ALGEIBA } }),
    prisma.system.findMany({
      orderBy: { updatedAt: 'desc' },
      take: 5,
      include: { client: true }
    }),
    prisma.system.findMany({
      where: { nextPaymentDate: { not: null } },
      orderBy: { nextPaymentDate: 'asc' },
      take: 4
    })
  ])

  const stats = [
    { title: "Total Sistemas", value: total, icon: Grid, color: "text-violet-400", bg: "bg-violet-500/10" },
    { title: "Sistemas Propios", value: propios, icon: Server, color: "text-blue-400", bg: "bg-blue-500/10" },
    { title: "Sistemas Clientes", value: clientes, icon: Users, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { title: "Sistemas Algeiba", value: algeiba, icon: ShieldCheck, color: "text-orange-400", bg: "bg-orange-500/10" },
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-20">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">Overview</h1>
        <p className="mt-2 text-zinc-400">Resumen general del estado de tu infraestructura y finanzas.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <div key={i} className="rounded-2xl border border-white/5 bg-zinc-900/40 backdrop-blur-md p-6 hover:bg-zinc-900/60 transition-colors">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-zinc-400">{stat.title}</p>
              <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                <stat.icon size={18} />
              </div>
            </div>
            <p className="mt-4 text-3xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Próximos Vencimientos */}
        <div className="lg:col-span-2 rounded-2xl border border-white/5 bg-zinc-900/40 backdrop-blur-md p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/10 text-red-400">
                <Wallet size={18} />
              </div>
              <h3 className="font-semibold text-white">Próximos Cobros</h3>
            </div>
            <Link href="/sistemas" className="text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors">
              Ver todos <ArrowUpRight size={16} />
            </Link>
          </div>
          
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-zinc-500 border-b border-white/5">
                <tr>
                  <th className="pb-3 font-medium">Sistema</th>
                  <th className="pb-3 font-medium">Estado</th>
                  <th className="pb-3 font-medium text-right">Fecha Venc.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {ultimosPagos.map((pago, idx) => {
                  const diffTime = (pago.nextPaymentDate?.getTime() || 0) - new Date().getTime();
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  const isUrgent = diffDays <= 7;

                  return (
                    <tr key={idx} className="group">
                      <td className="py-4 text-zinc-200 font-medium">{pago.name}</td>
                      <td className="py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-semibold ${isUrgent ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isUrgent ? 'bg-red-500' : 'bg-emerald-500'}`} />
                          {isUrgent ? `Vence en ${diffDays} días` : 'Al día'}
                        </span>
                      </td>
                      <td className={`py-4 text-right font-semibold ${isUrgent ? 'text-red-400' : 'text-zinc-400'}`}>
                        {pago.nextPaymentDate?.toLocaleDateString('es-ES')}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sistemas Recientes */}
        <div className="rounded-2xl border border-white/5 bg-zinc-900/40 backdrop-blur-md p-6">
          <h3 className="font-semibold text-white mb-6">Actividad Reciente</h3>
          <div className="space-y-4">
            {ultimosSistemas.map(sys => (
              <div key={sys.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group border border-transparent hover:border-white/5">
                <div>
                  <p className="font-medium text-zinc-200">{sys.name}</p>
                  <p className="text-xs text-zinc-500 mt-1">{sys.type}</p>
                </div>
                <div className="text-xs font-medium text-zinc-400 bg-white/5 px-2 py-1 rounded-md">
                  {sys.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}
