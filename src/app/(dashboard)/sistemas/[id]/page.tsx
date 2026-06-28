import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Server, Calendar, Building2, Terminal } from "lucide-react"

export const revalidate = 0

export default async function SystemDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  
  const sys = await prisma.system.findUnique({
    where: { id: resolvedParams.id },
    include: {
      client: true,
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

      {/* DETALLES EXTRA */}
      <div className="grid md:grid-cols-2 gap-16">
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Descripción & Notas</h2>
          <div className="rounded-3xl bg-zinc-900/30 border border-white/5 p-8 backdrop-blur-md">
             {sys.description || sys.notes ? (
               <div className="space-y-6 text-zinc-300">
                 {sys.description && <p>{sys.description}</p>}
                 {sys.notes && <p className="font-mono text-sm opacity-70">{sys.notes}</p>}
               </div>
             ) : (
               <p className="text-zinc-600 font-mono text-sm uppercase tracking-widest">Sin información detallada.</p>
             )}
          </div>
        </div>
      </div>

    </div>
  )
}
