import { prisma } from "@/lib/prisma"
import { SystemType } from "@prisma/client"
import { ArrowUpRight, Activity, Zap, Server, ShieldCheck, Wallet } from "lucide-react"
import Link from "next/link"

// Componente para forzar la revalidación si lo necesitas
export const revalidate = 0

export default async function DashboardPage() {
  const [total, propios, clientes, algeiba, ultimosSistemas, ultimosPagos] = await Promise.all([
    prisma.system.count(),
    prisma.system.count({ where: { type: SystemType.PROPIO } }),
    prisma.system.count({ where: { type: SystemType.CLIENTE } }),
    prisma.system.count({ where: { type: SystemType.ALGEIBA } }),
    // Obtener los 4 sistemas más recientes añadidos/actualizados
    prisma.system.findMany({
      orderBy: { updatedAt: 'desc' },
      take: 4,
      include: { client: true }
    }),
    // Obtener cobros próximos reales simulados (sistemas con nextPaymentDate cercano)
    prisma.system.findMany({
      where: { nextPaymentDate: { not: null } },
      orderBy: { nextPaymentDate: 'asc' },
      take: 3
    })
  ])

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-20">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm font-medium mb-4">
            <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
            Sistema en Línea
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-500">
            Overview.
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-2xl font-bold text-white">{total}</p>
            <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">Sistemas Totales</p>
          </div>
        </div>
      </div>

      {/* BENTO GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        
        {/* BIG HERO CARD - Sistemas Clientes */}
        <div className="col-span-1 md:col-span-2 lg:col-span-2 row-span-2 rounded-[2rem] bg-zinc-900/30 border border-white/5 backdrop-blur-md p-8 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6 border border-emerald-500/20">
                <Activity size={24} />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Clientes</h2>
              <p className="text-zinc-400 text-lg">Tienes {clientes} sistemas desplegados en infraestructura de clientes.</p>
            </div>
            
            <div className="mt-12 flex items-center justify-between">
              <Link href="/clientes" className="inline-flex items-center gap-2 text-emerald-400 font-semibold hover:text-emerald-300 transition-colors">
                Ver Directorio <ArrowUpRight size={18} />
              </Link>
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 border-[6px] border-emerald-500/20 rounded-full" />
                <div 
                  className="absolute inset-0 border-[6px] border-emerald-500 rounded-full" 
                  style={{ clipPath: `polygon(0 0, 100% 0, 100% ${clientes * 10}%, 0 100%)` }} 
                />
                <div className="absolute inset-0 flex items-center justify-center text-xl font-bold text-white">{clientes}</div>
              </div>
            </div>
          </div>
        </div>

        {/* SMALL CARD 1 - Propios */}
        <div className="rounded-[2rem] bg-zinc-900/30 border border-white/5 backdrop-blur-md p-6 relative overflow-hidden group">
           <div className="absolute -right-4 -top-4 w-24 h-24 bg-violet-500/20 blur-2xl rounded-full" />
           <div className="w-10 h-10 rounded-xl bg-violet-500/20 text-violet-400 flex items-center justify-center mb-4">
             <Server size={20} />
           </div>
           <p className="text-4xl font-bold text-white mb-1">{propios}</p>
           <p className="text-sm font-medium text-zinc-500">Sistemas Propios</p>
        </div>

        {/* SMALL CARD 2 - Algeiba */}
        <div className="rounded-[2rem] bg-zinc-900/30 border border-white/5 backdrop-blur-md p-6 relative overflow-hidden group">
           <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-orange-500/20 blur-2xl rounded-full" />
           <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center mb-4">
             <Zap size={20} />
           </div>
           <p className="text-4xl font-bold text-white mb-1">{algeiba}</p>
           <p className="text-sm font-medium text-zinc-500">Sistemas Algeiba</p>
        </div>

        {/* WIDE LIST CARD - Últimos Sistemas */}
        <div className="col-span-1 md:col-span-2 lg:col-span-2 rounded-[2rem] bg-zinc-900/30 border border-white/5 backdrop-blur-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-zinc-200">Sistemas Recientes</h3>
            <Link href="/sistemas" className="text-xs font-medium text-zinc-500 hover:text-white transition-colors">
              Ver todos
            </Link>
          </div>
          <div className="space-y-4">
            {ultimosSistemas.map(sys => (
              <div key={sys.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-white/10 flex items-center justify-center group-hover:bg-zinc-700 transition-colors">
                    <ShieldCheck size={18} className="text-zinc-400 group-hover:text-violet-400" />
                  </div>
                  <div>
                    <p className="font-medium text-zinc-200">{sys.name}</p>
                    <p className="text-xs text-zinc-500">{sys.type} {sys.env ? `• ${sys.env}` : ''}</p>
                  </div>
                </div>
                <div className="px-2 py-1 rounded-md bg-white/5 text-xs font-medium text-zinc-400 border border-white/5">
                  {sys.status}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FINANCE CARD - Próximos Cobros */}
        <div className="col-span-1 md:col-span-3 lg:col-span-4 rounded-[2rem] bg-gradient-to-r from-zinc-900/50 to-zinc-900/20 border border-white/5 backdrop-blur-md p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] mix-blend-overlay" />
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <div className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center">
              <Wallet size={16} />
            </div>
            <h3 className="font-semibold text-zinc-200">Próximos Cobros a Clientes</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
            {ultimosPagos.map((pago, idx) => {
              // Calcular los días faltantes súper rápido
              const diffTime = (pago.nextPaymentDate?.getTime() || 0) - new Date().getTime();
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              const isUrgent = diffDays <= 7;
              
              return (
                <div key={idx} className="p-4 rounded-2xl bg-zinc-950/50 border border-white/5 flex flex-col justify-between hover:border-white/10 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-medium text-zinc-200">{pago.name}</span>
                    <span className={`w-2 h-2 rounded-full ${isUrgent ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">Vencimiento</p>
                    <p className={`text-lg font-bold ${isUrgent ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {pago.nextPaymentDate?.toLocaleDateString('es-ES')}
                    </p>
                    <p className="text-xs text-zinc-600 mt-1">
                      {isUrgent ? `En ${diffDays} días` : 'Al día'}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}
