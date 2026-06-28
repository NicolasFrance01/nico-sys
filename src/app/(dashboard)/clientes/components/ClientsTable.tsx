"use client"

import { useState } from "react"
import { Search, Plus, Trash2, Building2, X } from "lucide-react"
import { deleteClient, createClient } from "../actions"

type ClientData = {
  id: string
  name: string
  createdAt: Date
  systemsCount: number
}

export function ClientsTable({ initialData }: { initialData: ClientData[] }) {
  const [search, setSearch] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const filteredClients = initialData.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  async function handleDelete(id: string) {
    if (!confirm("¿Estás seguro de que deseas eliminar este cliente? Se borrarán sus sistemas asociados (Cascade).")) return
    await deleteClient(id)
  }

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    
    await createClient(formData.get("name") as string)
    
    setIsSubmitting(false)
    setIsModalOpen(false)
  }

  return (
    <div className="space-y-6 relative">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input 
            type="text" 
            placeholder="Buscar cliente..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-zinc-900/50 py-3 pl-12 pr-4 text-sm text-zinc-200 placeholder:text-zinc-500 focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/50 transition-all font-mono"
          />
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-2xl bg-white hover:bg-zinc-200 px-6 py-3 text-sm font-bold text-black transition-colors shadow-lg shadow-white/10 uppercase tracking-widest"
        >
          <Plus size={18} strokeWidth={2.5} />
          Nuevo Cliente
        </button>
      </div>

      {/* Table */}
      <div className="rounded-[2rem] border border-white/10 bg-zinc-900/30 backdrop-blur-2xl overflow-hidden p-2 shadow-2xl">
        <div className="overflow-x-auto rounded-[1.5rem] bg-black/40">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="border-b border-white/10 text-zinc-400 font-mono uppercase tracking-widest text-xs">
              <tr>
                <th className="px-6 py-5 font-semibold">Cliente</th>
                <th className="px-6 py-5 font-semibold">Sistemas Activos</th>
                <th className="px-6 py-5 font-semibold">Fecha de Alta</th>
                <th className="px-6 py-5 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredClients.map((client) => (
                <tr key={client.id} className="group hover:bg-white/[0.04] transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 text-zinc-300">
                        <Building2 size={20} />
                      </div>
                      <div className="font-bold text-white text-base">{client.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <div className={`w-1.5 h-1.5 rounded-full bg-emerald-500`} />
                      {client.systemsCount} sistemas
                    </span>
                  </td>
                  <td className="px-6 py-5 text-zinc-500 font-mono">
                    {new Date(client.createdAt).toLocaleDateString('es-ES').replace(/\//g, '.')}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleDelete(client.id)} className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition-colors" title="Eliminar">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredClients.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center text-zinc-500 font-mono text-xs uppercase tracking-widest">
                    No se encontraron clientes.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-8 w-full max-w-md shadow-[0_0_100px_rgba(52,211,153,0.15)]">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-white">Nuevo Cliente</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-6">
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-zinc-500 mb-2">Nombre de la Empresa</label>
                <input required name="name" type="text" className="w-full rounded-xl border border-white/10 bg-black py-3 px-4 text-white focus:border-emerald-500 focus:outline-none" />
              </div>
              
              <button disabled={isSubmitting} type="submit" className="w-full rounded-xl bg-white hover:bg-zinc-200 py-4 text-sm font-black text-black uppercase tracking-widest transition-colors mt-4">
                {isSubmitting ? 'Creando...' : 'Registrar Cliente'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
