import { prisma } from "@/lib/prisma"
import { SystemType } from "@prisma/client"
import { ArrowRight, Server, ShieldCheck } from "lucide-react"
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
      take: 4,
      include: { client: true }
    }),
    prisma.system.findMany({
      where: { nextPaymentDate: { not: null } },
      orderBy: { nextPaymentDate: 'asc' },
      take: 3
    })
  ])

  return (
    <div className="max-w-[1400px] mx-auto space-y-24 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-32">
      
      {/* HERO SECTION - Editorial Style */}
      <div className="pt-12">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-[1px] w-12 bg-violet-500" />
          <p className="text-violet-400 font-mono text-sm tracking-widest uppercase">Centro de Comando</p>
        </div>
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white leading-[0.9]">
          Visión <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-400 to-zinc-700">Global.</span>
        </h1>
      </div>

      {/* MASSIVE METRICS ROW */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-16 border-t border-white/5 pt-16">
        <div className="flex flex-col">
          <span className="text-8xl font-black tracking-tighter text-white">{total}</span>
          <span className="text-zinc-500 font-mono text-sm mt-2 uppercase tracking-widest">Sistemas Activos</span>
        </div>
        <div className="flex flex-col">
          <span className="text-7xl font-black tracking-tighter text-emerald-400 opacity-90">{clientes}</span>
          <span className="text-zinc-500 font-mono text-sm mt-2 uppercase tracking-widest">Clientes</span>
        </div>
        <div className="flex flex-col">
          <span className="text-7xl font-black tracking-tighter text-blue-400 opacity-90">{propios}</span>
          <span className="text-zinc-500 font-mono text-sm mt-2 uppercase tracking-widest">Propios</span>
        </div>
        <div className="flex flex-col">
          <span className="text-7xl font-black tracking-tighter text-orange-400 opacity-90">{algeiba}</span>
          <span className="text-zinc-500 font-mono text-sm mt-2 uppercase tracking-widest">Algeiba</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-16">
        {/* RADICAL FINANCE SECTION */}
        <div className="relative group">
          <div className="absolute -inset-4 bg-gradient-to-r from-red-500/10 to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <div className="relative">
            <h2 className="text-3xl font-bold tracking-tight text-white mb-8">Radar de Vencimientos</h2>
            <div className="space-y-6">
              {ultimosPagos.map((pago, idx) => {
                const diffTime = (pago.nextPaymentDate?.getTime() || 0) - new Date().getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                const isUrgent = diffDays <= 7;

                return (
                  <div key={idx} className="flex items-center justify-between group/row">
                    <div className="flex items-center gap-6">
                      <div className={`w-2 h-12 rounded-full ${isUrgent ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-emerald-500'}`} />
                      <div>
                        <p className="text-2xl font-bold text-zinc-200 group-hover/row:text-white transition-colors">{pago.name}</p>
                        <p className="text-zinc-500 text-sm font-mono mt-1">{isUrgent ? `ALERTA: Vence en ${diffDays} días` : 'ESTADO: Al día'}</p>
                      </div>
                    </div>
                    <div className={`text-xl font-mono tracking-tighter ${isUrgent ? 'text-red-400' : 'text-emerald-400'}`}>
                      {pago.nextPaymentDate?.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }).toUpperCase()}
                    </div>
                  </div>
                )
              })}
            </div>
            
            <div className="mt-10">
               <Link href="/sistemas" className="inline-flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors group/btn">
                  Ver todos los cobros 
                  <ArrowRight size={16} className="group-hover/btn:translate-x-2 transition-transform" />
               </Link>
            </div>
          </div>
        </div>

        {/* RECENT ACTIVITY - MINIMALIST */}
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white mb-8">Últimos Despliegues</h2>
          <div className="divide-y divide-white/5 border-t border-white/5">
            {ultimosSistemas.map(sys => (
              <div key={sys.id} className="py-6 flex justify-between items-center group/sys">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full border border-white/10 flex items-center justify-center text-zinc-500 group-hover/sys:bg-white group-hover/sys:text-black transition-all">
                    {sys.type === 'ALGEIBA' ? <ShieldCheck size={16} /> : <Server size={16} />}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-300 group-hover/sys:text-white transition-colors">{sys.name}</h3>
                    <p className="text-xs font-mono text-zinc-600 mt-1">{sys.env} // {sys.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 rounded-full border border-white/10 text-[10px] uppercase tracking-widest text-zinc-400">
                    {sys.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}
