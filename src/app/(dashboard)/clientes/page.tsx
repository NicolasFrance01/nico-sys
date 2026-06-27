import { prisma } from "@/lib/prisma"
import { UsersRound, Building2 } from "lucide-react"

export const revalidate = 0

export default async function ClientesPage() {
  const clients = await prisma.client.findMany({
    include: {
      systems: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-200 to-white">
            Directorio.
          </h1>
          <p className="mt-4 text-lg text-zinc-400 max-w-xl">
            Gestión centralizada de tu cartera de clientes y los sistemas asociados a cada uno de ellos.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {clients.map((client) => (
          <div 
            key={client.id} 
            className="group relative rounded-3xl bg-zinc-900/30 border border-white/5 backdrop-blur-md p-8 overflow-hidden hover:bg-zinc-900/50 hover:border-white/10 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-teal-500/0 group-hover:from-emerald-500/5 group-hover:to-teal-500/5 transition-all duration-500" />
            
            <div className="relative z-10 flex items-start gap-6">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0 text-emerald-400">
                <Building2 size={32} />
              </div>
              
              <div className="flex-1">
                <h3 className="font-bold text-white text-2xl mb-1">{client.name}</h3>
                <p className="text-sm text-zinc-500 mb-6">Cliente registrado el {client.createdAt.toLocaleDateString('es-ES')}</p>
                
                <div className="flex items-center gap-4">
                  <div className="px-4 py-2 rounded-xl bg-black/20 border border-white/5 flex items-center gap-3">
                    <UsersRound size={16} className="text-zinc-400" />
                    <div>
                      <p className="text-xs text-zinc-500 font-medium">Sistemas Activos</p>
                      <p className="font-bold text-white">{client.systems.length}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
