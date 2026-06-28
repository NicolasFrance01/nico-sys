import { prisma } from "@/lib/prisma"
import { UsersRound, Building2, Search, Plus, MoreVertical } from "lucide-react"

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
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-20">
      
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">Directorio</h1>
          <p className="mt-2 text-zinc-400">Gestiona tu base de clientes (CRM) y sus proyectos asociados.</p>
        </div>
        
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input 
              type="text" 
              placeholder="Buscar cliente..." 
              className="w-full md:w-64 rounded-xl border border-white/10 bg-zinc-900/50 py-2.5 pl-10 pr-4 text-sm text-zinc-200 placeholder:text-zinc-500 focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/50 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 rounded-xl bg-violet-600 hover:bg-violet-500 px-4 py-2.5 text-sm font-medium text-white transition-colors shadow-lg shadow-violet-500/20">
            <Plus size={18} />
            Nuevo Cliente
          </button>
        </div>
      </div>

      {/* CRM List */}
      <div className="rounded-2xl border border-white/5 bg-zinc-900/30 backdrop-blur-md overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/5 bg-zinc-950/50 text-zinc-400">
            <tr>
              <th className="px-6 py-4 font-medium">Cliente</th>
              <th className="px-6 py-4 font-medium">Sistemas Activos</th>
              <th className="px-6 py-4 font-medium">Fecha de Alta</th>
              <th className="px-6 py-4 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {clients.map((client) => (
              <tr key={client.id} className="group hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-white/10 flex items-center justify-center flex-shrink-0 text-zinc-300">
                      <Building2 size={18} />
                    </div>
                    <div className="font-semibold text-zinc-200">{client.name}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <UsersRound size={14} />
                    {client.systems.length} sistemas
                  </span>
                </td>
                <td className="px-6 py-4 text-zinc-400">
                  {client.createdAt.toLocaleDateString('es-ES')}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-zinc-400 hover:text-white p-2 transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}
