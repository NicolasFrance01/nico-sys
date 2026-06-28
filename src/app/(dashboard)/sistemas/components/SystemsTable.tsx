"use client"

import { useState } from "react"
import { Search, Plus, Edit2, Trash2, Filter, X } from "lucide-react"
import Link from "next/link"
import { deleteSystem, createSystem, updateSystem } from "../actions"

type SystemData = {
  id: string
  name: string
  type: string
  subtype?: string | null
  env: string
  status: string
  clientName: string | null
  nextPaymentDate: Date | null
  paymentStatus: string
}

export function SystemsTable({ initialData }: { initialData: SystemData[] }) {
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("ALL")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [systemToEdit, setSystemToEdit] = useState<SystemData | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Filter systems directly from props so UI updates on Revalidate
  const filteredSystems = initialData.filter(sys => {
    const matchesSearch = sys.name.toLowerCase().includes(search.toLowerCase()) || 
                          (sys.clientName || "").toLowerCase().includes(search.toLowerCase())
    
    let matchesType = false
    if (typeFilter === "ALL") matchesType = true
    else if (typeFilter === "ATLASCORE") matchesType = sys.subtype === "Atlascore"
    else matchesType = sys.type === typeFilter

    return matchesSearch && matchesType
  })

  async function handleDelete(id: string) {
    if (!confirm("¿Estás seguro de que deseas eliminar este sistema?")) return
    await deleteSystem(id)
  }

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    
    const paymentDateStr = formData.get("nextPaymentDate") as string
    const paymentDate = paymentDateStr ? new Date(paymentDateStr) : null
    
    await createSystem({
      name: formData.get("name") as string,
      type: formData.get("type") as any,
      env: formData.get("env") as any,
      status: formData.get("status") as any,
      nextPaymentDate: paymentDate
    })
    
    setIsSubmitting(false)
    setIsModalOpen(false)
  }

  async function handleEdit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if(!systemToEdit) return
    setIsSubmitting(true)
    // Here we'd call an update action (which we need to write)
    const formData = new FormData(e.currentTarget)
    
    const paymentDateStr = formData.get("nextPaymentDate") as string
    const paymentDate = paymentDateStr ? new Date(paymentDateStr) : null

    await updateSystem(systemToEdit.id, {
      name: formData.get("name") as string,
      type: formData.get("type") as any,
      env: formData.get("env") as any,
      status: formData.get("status") as any,
      nextPaymentDate: paymentDate
    })

    setIsSubmitting(false)
    setIsEditModalOpen(false)
    setSystemToEdit(null)
  }

  return (
    <div className="space-y-6 relative">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por nombre o cliente..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-zinc-900/50 py-3 pl-12 pr-4 text-sm text-zinc-200 placeholder:text-zinc-500 focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/50 transition-all font-mono"
            />
          </div>
          
          <div className="relative">
            <select 
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="appearance-none rounded-2xl border border-white/10 bg-zinc-900/50 py-3 pl-12 pr-12 text-sm text-zinc-300 focus:border-violet-500/50 focus:outline-none transition-all cursor-pointer font-mono"
            >
              <option value="ALL">TODOS LOS TIPOS</option>
              <option value="PROPIO">PROPIOS</option>
              <option value="CLIENTE">CLIENTES</option>
              <option value="ALGEIBA">ALGEIBA</option>
              <option value="ATLASCORE">ATLASCORE</option>
            </select>
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" size={16} />
          </div>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-2xl bg-white hover:bg-zinc-200 px-6 py-3 text-sm font-bold text-black transition-colors shadow-lg shadow-white/10 uppercase tracking-widest"
        >
          <Plus size={18} strokeWidth={2.5} />
          Nuevo Sistema
        </button>
      </div>

      {/* Table */}
      <div className="rounded-[2rem] border border-white/10 bg-zinc-900/30 backdrop-blur-2xl overflow-hidden p-2 shadow-2xl">
        <div className="overflow-x-auto rounded-[1.5rem] bg-black/40">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="border-b border-white/10 text-zinc-400 font-mono uppercase tracking-widest text-xs">
              <tr>
                <th className="px-6 py-5 font-semibold">Sistema</th>
                <th className="px-6 py-5 font-semibold">Cliente</th>
                <th className="px-6 py-5 font-semibold">Tecnología</th>
                <th className="px-6 py-5 font-semibold">Cobro</th>
                <th className="px-6 py-5 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredSystems.map((sys) => {
                const isUrgent = sys.paymentStatus === 'COBRAR'
                const isWarning = sys.paymentStatus === 'POR_COBRAR'
                
                return (
                  <tr key={sys.id} className="group hover:bg-white/[0.04] transition-colors">
                    <td className="px-6 py-5">
                      <div className="font-bold text-white text-base">{sys.name}</div>
                      <div className="text-xs text-zinc-500 flex items-center gap-2 mt-1 font-mono uppercase tracking-wider">
                        <span className={`w-1.5 h-1.5 rounded-full ${sys.status === 'ACTIVO' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        {sys.status}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-zinc-400 font-medium">
                      {sys.clientName || <span className="opacity-30">Interno</span>}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex gap-2">
                        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-white/10 text-zinc-200 border border-white/10">
                          {sys.type}
                        </span>
                        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-violet-500/20 text-violet-300 border border-violet-500/30">
                          {sys.env}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      {sys.type === 'CLIENTE' && sys.nextPaymentDate ? (
                        <div className="flex items-center gap-3">
                          <span className={`w-2 h-2 rounded-full ${isUrgent ? 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,1)]' : isWarning ? 'bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.5)]' : 'bg-emerald-500'}`} />
                          <span className={`font-mono text-xs tracking-widest font-bold ${isUrgent ? 'text-red-400' : isWarning ? 'text-amber-400' : 'text-zinc-500'}`}>
                            {new Date(sys.nextPaymentDate).toLocaleDateString('es-ES').replace(/\//g, '.')}
                          </span>
                        </div>
                      ) : (
                        <span className="text-zinc-700 font-mono">---</span>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/sistemas/${sys.id}`} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors" title="Detalles">
                          <Search size={16} />
                        </Link>
                        <button onClick={() => { setSystemToEdit(sys); setIsEditModalOpen(true); }} className="p-2 rounded-xl bg-white/5 hover:bg-blue-500/20 text-zinc-400 hover:text-blue-400 transition-colors" title="Editar">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(sys.id)} className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition-colors" title="Eliminar">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {filteredSystems.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-zinc-500 font-mono text-xs uppercase tracking-widest">
                    No se encontraron sistemas.
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
          <div className="bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-8 w-full max-w-md shadow-[0_0_100px_rgba(139,92,246,0.15)]">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-white">Nuevo Sistema</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-6">
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-zinc-500 mb-2">Nombre del Sistema</label>
                <input required name="name" type="text" className="w-full rounded-xl border border-white/10 bg-black py-3 px-4 text-white focus:border-violet-500 focus:outline-none" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-zinc-500 mb-2">Tipo</label>
                  <select name="type" className="w-full rounded-xl border border-white/10 bg-black py-3 px-4 text-white focus:border-violet-500 focus:outline-none appearance-none">
                    <option value="PROPIO">PROPIO</option>
                    <option value="CLIENTE">CLIENTE</option>
                    <option value="ALGEIBA">ALGEIBA</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-zinc-500 mb-2">Entorno</label>
                  <select name="env" className="w-full rounded-xl border border-white/10 bg-black py-3 px-4 text-white focus:border-violet-500 focus:outline-none appearance-none">
                    <option value="PROD">PROD</option>
                    <option value="TEST_NICO">TEST_NICO</option>
                    <option value="LOCAL">LOCAL</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-zinc-500 mb-2">Estado Inicial</label>
                  <select name="status" className="w-full rounded-xl border border-white/10 bg-black py-3 px-4 text-white focus:border-violet-500 focus:outline-none appearance-none">
                    <option value="ACTIVO">ACTIVO</option>
                    <option value="EN_DESARROLLO">EN DESARROLLO</option>
                    <option value="PAUSADO">PAUSADO</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-zinc-500 mb-2">Fecha de Cobro (Opcional)</label>
                  <input name="nextPaymentDate" type="date" className="w-full rounded-xl border border-white/10 bg-black py-3 px-4 text-white focus:border-violet-500 focus:outline-none [color-scheme:dark]" />
                </div>
              </div>

              <button disabled={isSubmitting} type="submit" className="w-full rounded-xl bg-white hover:bg-zinc-200 py-4 text-sm font-black text-black uppercase tracking-widest transition-colors mt-4">
                {isSubmitting ? 'Creando...' : 'Desplegar Sistema'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {isEditModalOpen && systemToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-8 w-full max-w-md shadow-[0_0_100px_rgba(59,130,246,0.15)]">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-white">Editar Sistema</h2>
              <button onClick={() => { setIsEditModalOpen(false); setSystemToEdit(null); }} className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleEdit} className="space-y-6">
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-zinc-500 mb-2">Nombre del Sistema</label>
                <input required defaultValue={systemToEdit.name} name="name" type="text" className="w-full rounded-xl border border-white/10 bg-black py-3 px-4 text-white focus:border-blue-500 focus:outline-none" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-zinc-500 mb-2">Tipo</label>
                  <select defaultValue={systemToEdit.type} name="type" className="w-full rounded-xl border border-white/10 bg-black py-3 px-4 text-white focus:border-blue-500 focus:outline-none appearance-none">
                    <option value="PROPIO">PROPIO</option>
                    <option value="CLIENTE">CLIENTE</option>
                    <option value="ALGEIBA">ALGEIBA</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-zinc-500 mb-2">Entorno</label>
                  <select defaultValue={systemToEdit.env} name="env" className="w-full rounded-xl border border-white/10 bg-black py-3 px-4 text-white focus:border-blue-500 focus:outline-none appearance-none">
                    <option value="PROD">PROD</option>
                    <option value="TEST_NICO">TEST_NICO</option>
                    <option value="LOCAL">LOCAL</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-zinc-500 mb-2">Estado Inicial</label>
                  <select defaultValue={systemToEdit.status} name="status" className="w-full rounded-xl border border-white/10 bg-black py-3 px-4 text-white focus:border-blue-500 focus:outline-none appearance-none">
                    <option value="ACTIVO">ACTIVO</option>
                    <option value="EN_DESARROLLO">EN DESARROLLO</option>
                    <option value="PAUSADO">PAUSADO</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-zinc-500 mb-2">Fecha de Cobro (Opcional)</label>
                  <input defaultValue={systemToEdit.nextPaymentDate ? new Date(systemToEdit.nextPaymentDate).toISOString().split('T')[0] : ''} name="nextPaymentDate" type="date" className="w-full rounded-xl border border-white/10 bg-black py-3 px-4 text-white focus:border-blue-500 focus:outline-none [color-scheme:dark]" />
                </div>
              </div>

              <button disabled={isSubmitting} type="submit" className="w-full rounded-xl bg-white hover:bg-zinc-200 py-4 text-sm font-black text-black uppercase tracking-widest transition-colors mt-4">
                {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
