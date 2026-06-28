"use client"

import { useState } from "react"
import { Search, Plus, MoreVertical, Edit2, Trash2, Filter } from "lucide-react"
import Link from "next/link"

type SystemData = {
  id: string
  name: string
  type: string
  env: string
  status: string
  clientName: string | null
  nextPaymentDate: Date | null
  paymentStatus: string
}

export function SystemsTable({ initialData }: { initialData: SystemData[] }) {
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("ALL")
  const [systems, setSystems] = useState(initialData)

  const filteredSystems = systems.filter(sys => {
    const matchesSearch = sys.name.toLowerCase().includes(search.toLowerCase()) || 
                          (sys.clientName || "").toLowerCase().includes(search.toLowerCase())
    const matchesType = typeFilter === "ALL" || sys.type === typeFilter
    return matchesSearch && matchesType
  })

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por nombre o cliente..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-zinc-900/50 py-2.5 pl-10 pr-4 text-sm text-zinc-200 placeholder:text-zinc-500 focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/50 transition-all"
            />
          </div>
          
          <div className="relative">
            <select 
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="appearance-none rounded-xl border border-white/10 bg-zinc-900/50 py-2.5 pl-10 pr-10 text-sm text-zinc-300 focus:border-violet-500/50 focus:outline-none transition-all cursor-pointer"
            >
              <option value="ALL">Todos los tipos</option>
              <option value="PROPIO">Propios</option>
              <option value="CLIENTE">Clientes</option>
              <option value="ALGEIBA">Algeiba</option>
            </select>
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" size={16} />
          </div>
        </div>

        <button className="flex items-center gap-2 rounded-xl bg-violet-600 hover:bg-violet-500 px-4 py-2.5 text-sm font-medium text-white transition-colors shadow-lg shadow-violet-500/20">
          <Plus size={18} />
          Nuevo Sistema
        </button>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/5 bg-zinc-900/30 backdrop-blur-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/5 bg-zinc-950/50 text-zinc-400">
              <tr>
                <th className="px-6 py-4 font-medium">Sistema</th>
                <th className="px-6 py-4 font-medium">Cliente</th>
                <th className="px-6 py-4 font-medium">Tipo / Entorno</th>
                <th className="px-6 py-4 font-medium">Próximo Cobro</th>
                <th className="px-6 py-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredSystems.map((sys) => {
                const isUrgent = sys.paymentStatus === 'COBRAR'
                const isWarning = sys.paymentStatus === 'POR_COBRAR'
                
                return (
                  <tr key={sys.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-zinc-200">{sys.name}</div>
                      <div className="text-xs text-zinc-500 flex items-center gap-2 mt-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${sys.status === 'ACTIVO' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        {sys.status}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-zinc-400">
                      {sys.clientName || <span className="italic opacity-50">Interno</span>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-white/5 text-zinc-300 border border-white/5">
                          {sys.type}
                        </span>
                        <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-violet-500/10 text-violet-300 border border-violet-500/20">
                          {sys.env}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {sys.type === 'CLIENTE' && sys.nextPaymentDate ? (
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${isUrgent ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                          <span className={isUrgent ? 'text-red-400 font-medium' : isWarning ? 'text-amber-400 font-medium' : 'text-zinc-400'}>
                            {new Date(sys.nextPaymentDate).toLocaleDateString('es-ES')}
                          </span>
                        </div>
                      ) : (
                        <span className="text-zinc-600">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/sistemas/${sys.id}`} className="text-zinc-400 hover:text-violet-400 transition-colors tooltip-trigger" title="Ver detalles">
                          <Search size={18} />
                        </Link>
                        <button className="text-zinc-400 hover:text-blue-400 transition-colors" title="Editar">
                          <Edit2 size={18} />
                        </button>
                        <button className="text-zinc-400 hover:text-red-400 transition-colors" title="Eliminar">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {filteredSystems.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                    No se encontraron sistemas que coincidan con los filtros.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
