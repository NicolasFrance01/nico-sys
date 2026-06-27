import { prisma } from "@/lib/prisma"
import { ShieldAlert, ShieldCheck, Globe, Key, Clock, ExternalLink } from "lucide-react"
import { calculatePaymentStatus } from "@/lib/payments"

export const revalidate = 0

export default async function SistemasPage() {
  const systems = await prisma.system.findMany({
    include: {
      client: true,
      urls: true,
      credentials: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-500">
            Ecosistema.
          </h1>
          <p className="mt-4 text-lg text-zinc-400 max-w-xl">
            Centro de control unificado. Monitorea ambientes, credenciales y pagos de todos tus despliegues.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {systems.map((sys) => {
          const paymentStatus = calculatePaymentStatus(sys.nextPaymentDate)
          const isUrgent = paymentStatus === 'COBRAR'
          const isWarning = paymentStatus === 'POR_COBRAR'

          return (
            <div 
              key={sys.id} 
              className="group relative rounded-3xl bg-zinc-900/30 border border-white/5 backdrop-blur-md p-6 overflow-hidden hover:bg-zinc-900/50 hover:border-white/10 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"
            >
              {/* Glow background on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/0 to-fuchsia-500/0 group-hover:from-violet-500/5 group-hover:to-fuchsia-500/5 transition-all duration-500" />
              
              <div className="relative z-10 flex flex-col h-full justify-between gap-8">
                
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-white/10 flex items-center justify-center">
                        <span className="text-white font-bold">{sys.name.charAt(0)}</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-lg leading-tight">{sys.name}</h3>
                        <p className="text-xs text-zinc-500 font-medium">{sys.client?.name || "Propio/Interno"}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Status Pills */}
                  <div className="flex flex-col items-end gap-2">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/5 text-zinc-300 border border-white/5">
                      {sys.type}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-violet-500/10 text-violet-300 border border-violet-500/20">
                      {sys.env}
                    </span>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="space-y-4">
                  {/* Payment Alert */}
                  {sys.type === 'CLIENTE' && sys.nextPaymentDate && (
                    <div className={`flex items-center gap-3 p-3 rounded-2xl border ${isUrgent ? 'bg-red-500/10 border-red-500/20 text-red-300' : isWarning ? 'bg-amber-500/10 border-amber-500/20 text-amber-300' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'}`}>
                      {isUrgent ? <ShieldAlert size={16} /> : <Clock size={16} />}
                      <div className="flex-1">
                        <p className="text-xs font-semibold uppercase tracking-wider opacity-80">Próximo Cobro</p>
                        <p className="font-medium text-sm">{sys.nextPaymentDate.toLocaleDateString('es-ES')}</p>
                      </div>
                      <span className="text-xs font-bold uppercase">
                        {paymentStatus.replace('_', ' ')}
                      </span>
                    </div>
                  )}

                  {/* URLs & Credentials */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-2xl bg-black/20 border border-white/5">
                      <div className="flex items-center gap-2 text-zinc-400 mb-1">
                        <Globe size={14} />
                        <span className="text-xs font-medium">URLs</span>
                      </div>
                      <p className="text-xl font-bold text-white">{sys.urls.length}</p>
                    </div>
                    <div className="p-3 rounded-2xl bg-black/20 border border-white/5">
                      <div className="flex items-center gap-2 text-zinc-400 mb-1">
                        <Key size={14} />
                        <span className="text-xs font-medium">Credenciales</span>
                      </div>
                      <p className="text-xl font-bold text-white">{sys.credentials.length}</p>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <button className="text-sm font-medium text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-2">
                    Ver detalles <ExternalLink size={14} />
                  </button>
                  <div className="flex -space-x-2">
                    {/* Fake avatars to show activity */}
                    <div className="w-6 h-6 rounded-full border border-zinc-900 bg-zinc-800 flex items-center justify-center text-[8px] font-bold">NF</div>
                  </div>
                </div>

              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
