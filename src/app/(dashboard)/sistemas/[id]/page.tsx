import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Server, Calendar, Building2, Terminal, Globe, Lock, ExternalLink, Wallet } from "lucide-react"
import { CredentialCard } from "./components/CredentialCard"
import { NotesEditor } from "./components/NotesEditor"
import { PaymentsTable } from "./components/PaymentsTable"
import { UrlsManager } from "./components/UrlsManager"
import { CredentialsManager } from "./components/CredentialsManager"

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
      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-12 border-y border-white/5 py-12">
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
      </div>

      {/* DETALLES EXTRA: URLs y Credenciales */}
      <div className="grid lg:grid-cols-2 gap-12">
        
        {/* COLUMNA IZQUIERDA: URLs */}
        <div>
          <UrlsManager systemId={sys.id} initialUrls={sys.urls} />
        </div>

        {/* COLUMNA DERECHA: CREDENCIALES */}
        <div>
          <CredentialsManager systemId={sys.id} initialCredentials={sys.credentials} />
        </div>

      </div>

      {/* BLOQUE INFERIOR: Descripción y Notas */}
      <div className="pt-8">
        <h2 className="text-2xl font-bold text-white mb-6">Descripción & Notas Generales</h2>
        <NotesEditor 
          systemId={sys.id}
          initialDescription={sys.description}
          initialNotes={sys.notes}
        />
      </div>

      {/* BLOQUE INFERIOR: Historial de Pagos */}
      <div className="pt-8">
        <div className="flex items-center gap-3 mb-6">
          <Wallet className="text-amber-400" size={24} />
          <h2 className="text-2xl font-bold text-white">Historial de Pagos</h2>
        </div>
        
        <PaymentsTable 
          systemId={sys.id}
          initialData={sys.payments.map(p => ({
            id: p.id,
            date: p.date,
            amount: p.amount,
            method: p.method,
            status: p.status,
            observations: p.observations
          }))}
        />
      </div>

    </div>
  )
}
