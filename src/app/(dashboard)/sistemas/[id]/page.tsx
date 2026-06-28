import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Server, Calendar, Building2, Terminal, Globe, Lock, ExternalLink, Wallet } from "lucide-react"
import { CredentialCard } from "./components/CredentialCard"

export const revalidate = 0

export default async function SystemDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  
  const sys = await prisma.system.findUnique({
    where: { id: resolvedParams.id },
    include: {
      client: true,
      urls: true,
      credentials: true,
      payments: {
        orderBy: { date: 'desc' }
      }
    }
  })

  if (!sys) return notFound()

  return (
    <div className="max-w-[1200px] mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-32">
      
      {/* HEADER */}
      <div className="pt-8">
        <Link href="/sistemas" className="inline-flex items-center gap-3 text-zinc-500 hover:text-white transition-colors mb-8 font-mono text-xs uppercase tracking-widest group">
          <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> Volver al Ecosistema
        </Link>
        <div className="flex items-center gap-4 mb-4">
          <div className="h-[1px] w-12 bg-blue-500" />
          <p className="text-blue-400 font-mono text-sm tracking-widest uppercase">{sys.type} / {sys.env}</p>
        </div>
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white leading-[0.9]">
          {sys.name}
        </h1>
      </div>

      {/* METADATA GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12 border-y border-white/5 py-12">
        <div className="flex flex-col gap-2">
          <span className="text-zinc-500 font-mono text-xs uppercase tracking-widest flex items-center gap-2"><Server size={14}/> Estado Actual</span>
          <span className="text-3xl font-black tracking-tighter text-white uppercase">{sys.status}</span>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-zinc-500 font-mono text-xs uppercase tracking-widest flex items-center gap-2"><Building2 size={14}/> Cliente</span>
          <span className="text-3xl font-black tracking-tighter text-white">{sys.client?.name || 'Interno'}</span>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-zinc-500 font-mono text-xs uppercase tracking-widest flex items-center gap-2"><Calendar size={14}/> Próximo Cobro</span>
          <span className={`text-3xl font-black tracking-tighter ${sys.nextPaymentDate ? 'text-amber-400' : 'text-zinc-700'}`}>
            {sys.nextPaymentDate ? sys.nextPaymentDate.toLocaleDateString('es-ES') : 'N/A'}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-zinc-500 font-mono text-xs uppercase tracking-widest flex items-center gap-2"><Terminal size={14}/> ID Único</span>
          <span className="text-xl font-mono text-zinc-400">{sys.id.split('-')[0]}...</span>
        </div>
      </div>

      {/* DETALLES EXTRA: URLs y Credenciales */}
      <div className="grid lg:grid-cols-2 gap-12">
        
        {/* COLUMNA IZQUIERDA: URLs */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Globe className="text-blue-400" size={24} />
            <h2 className="text-2xl font-bold text-white">URLs del Sistema</h2>
          </div>
          
          <div className="space-y-4">
            {sys.urls.length > 0 ? (
              sys.urls.map(url => (
                <a key={url.id} href={url.url} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between p-5 rounded-2xl bg-zinc-900/30 border border-white/5 hover:bg-zinc-800/50 hover:border-white/10 transition-all">
                  <div>
                    <p className="text-white font-semibold">{url.name}</p>
                    <p className="text-blue-400 font-mono text-sm mt-1 group-hover:underline">{url.url}</p>
                  </div>
                  <ExternalLink size={18} className="text-zinc-500 group-hover:text-white transition-colors" />
                </a>
              ))
            ) : (
              <div className="p-6 rounded-2xl bg-zinc-900/10 border border-white/5 border-dashed text-center">
                <p className="text-zinc-600 font-mono text-sm uppercase tracking-widest">No hay URLs registradas.</p>
              </div>
            )}
          </div>
        </div>

        {/* COLUMNA DERECHA: CREDENCIALES */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Lock className="text-emerald-400" size={24} />
            <h2 className="text-2xl font-bold text-white">Credenciales</h2>
          </div>
          
          <div className="space-y-4">
            {sys.credentials.length > 0 ? (
              sys.credentials.map(cred => (
                <CredentialCard key={cred.id} cred={cred} />
              ))
            ) : (
              <div className="p-6 rounded-2xl bg-zinc-900/10 border border-white/5 border-dashed text-center">
                <p className="text-zinc-600 font-mono text-sm uppercase tracking-widest">No hay credenciales registradas.</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* BLOQUE INFERIOR: Descripción y Notas */}
      <div className="pt-8">
        <h2 className="text-2xl font-bold text-white mb-6">Descripción & Notas Generales</h2>
        <div className="rounded-3xl bg-zinc-900/30 border border-white/5 p-8 backdrop-blur-md">
            {sys.description || sys.notes ? (
              <div className="space-y-6 text-zinc-300">
                {sys.description && <p className="leading-relaxed">{sys.description}</p>}
                {sys.notes && (
                  <div className="pt-6 border-t border-white/5">
                    <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest mb-3">Notas Internas</p>
                    <p className="font-mono text-sm text-zinc-400 leading-relaxed whitespace-pre-wrap">{sys.notes}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-zinc-600 font-mono text-sm uppercase tracking-widest text-center py-4">Sin información detallada.</p>
            )}
        </div>
      </div>

      {/* BLOQUE INFERIOR: Historial de Pagos */}
      <div className="pt-8">
        <div className="flex items-center gap-3 mb-6">
          <Wallet className="text-amber-400" size={24} />
          <h2 className="text-2xl font-bold text-white">Historial de Pagos</h2>
        </div>
        
        <div className="rounded-3xl bg-zinc-900/30 border border-white/5 overflow-hidden backdrop-blur-md">
          {sys.payments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="border-b border-white/5 text-zinc-500 font-mono uppercase tracking-widest text-xs bg-black/40">
                  <tr>
                    <th className="px-8 py-6 font-semibold">Fecha</th>
                    <th className="px-8 py-6 font-semibold">Estado</th>
                    <th className="px-8 py-6 font-semibold">Monto</th>
                    <th className="px-8 py-6 font-semibold">Método</th>
                    <th className="px-8 py-6 font-semibold">Observaciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {sys.payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-8 py-6 text-white font-mono">
                        {payment.date.toLocaleDateString('es-ES')}
                      </td>
                      <td className="px-8 py-6">
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border ${
                          payment.status === 'PAGADO' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          payment.status === 'VENCIDO' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                          'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            payment.status === 'PAGADO' ? 'bg-emerald-500' :
                            payment.status === 'VENCIDO' ? 'bg-red-500' :
                            'bg-amber-500'
                          }`} />
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 font-mono text-zinc-300">
                        ${payment.amount.toLocaleString()}
                      </td>
                      <td className="px-8 py-6 font-mono text-zinc-500 text-xs tracking-widest uppercase">
                        {payment.method || '-'}
                      </td>
                      <td className="px-8 py-6 text-zinc-400 text-sm">
                        {payment.observations || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center border-dashed border-t-0">
              <p className="text-zinc-600 font-mono text-sm uppercase tracking-widest">No hay registros de pago en el historial.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}
