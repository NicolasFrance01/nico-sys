"use client"

import { useState } from "react"
import { Plus, Edit2, Trash2, X } from "lucide-react"
import { createPayment, updatePayment, deletePayment } from "../payment-actions"

type PaymentData = {
  id: string
  date: Date
  amount: number
  method: string | null
  status: 'PAGADO' | 'PENDIENTE' | 'VENCIDO' | string
  observations: string | null
}

export function PaymentsTable({ systemId, initialData }: { systemId: string, initialData: PaymentData[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [paymentToEdit, setPaymentToEdit] = useState<PaymentData | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleDelete(id: string) {
    if (!confirm("¿Estás seguro de que deseas eliminar este registro de pago?")) return
    await deletePayment(id, systemId)
  }

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    
    await createPayment(systemId, {
      date: new Date(formData.get("date") as string),
      amount: parseFloat(formData.get("amount") as string),
      method: formData.get("method") as string,
      status: formData.get("status") as any,
      observations: formData.get("observations") as string,
    })
    
    setIsSubmitting(false)
    setIsModalOpen(false)
  }

  async function handleEdit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if(!paymentToEdit) return
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    
    await updatePayment(paymentToEdit.id, {
      date: new Date(formData.get("date") as string),
      amount: parseFloat(formData.get("amount") as string),
      method: formData.get("method") as string,
      status: formData.get("status") as any,
      observations: formData.get("observations") as string,
    }, systemId)

    setIsSubmitting(false)
    setIsEditModalOpen(false)
    setPaymentToEdit(null)
  }

  return (
    <>
      <div className="rounded-3xl bg-zinc-900/30 border border-white/5 overflow-hidden backdrop-blur-md relative">
        
        {/* Botón Flotante para agregar pago */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="absolute top-4 right-4 z-10 flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 px-4 py-2 text-xs font-bold text-white transition-colors"
        >
          <Plus size={14} /> Registrar Pago
        </button>

        {initialData.length > 0 ? (
          <div className="overflow-x-auto pt-14">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="border-b border-white/5 text-zinc-500 font-mono uppercase tracking-widest text-xs bg-black/40">
                <tr>
                  <th className="px-8 py-6 font-semibold">Fecha</th>
                  <th className="px-8 py-6 font-semibold">Estado</th>
                  <th className="px-8 py-6 font-semibold">Monto</th>
                  <th className="px-8 py-6 font-semibold">Método</th>
                  <th className="px-8 py-6 font-semibold">Observaciones</th>
                  <th className="px-8 py-6 font-semibold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {initialData.map((payment) => (
                  <tr key={payment.id} className="group hover:bg-white/[0.02] transition-colors">
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
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity gap-2">
                        <button onClick={() => { setPaymentToEdit(payment); setIsEditModalOpen(true); }} className="p-2 rounded-xl bg-white/5 hover:bg-blue-500/20 text-zinc-400 hover:text-blue-400 transition-colors" title="Editar">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(payment.id)} className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition-colors" title="Eliminar">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-16 text-center pt-24">
            <p className="text-zinc-600 font-mono text-sm uppercase tracking-widest">No hay registros de pago en el historial.</p>
          </div>
        )}
      </div>

      {/* CREATE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-8 w-full max-w-md shadow-[0_0_100px_rgba(251,191,36,0.15)]">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-white">Registrar Pago</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-zinc-500 mb-2">Fecha</label>
                  <input required name="date" type="date" className="w-full rounded-xl border border-white/10 bg-black py-3 px-4 text-white focus:border-amber-500 focus:outline-none [color-scheme:dark]" />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-zinc-500 mb-2">Monto ($)</label>
                  <input required name="amount" type="number" step="0.01" className="w-full rounded-xl border border-white/10 bg-black py-3 px-4 text-white focus:border-amber-500 focus:outline-none" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-zinc-500 mb-2">Estado</label>
                  <select required name="status" className="w-full rounded-xl border border-white/10 bg-black py-3 px-4 text-white focus:border-amber-500 focus:outline-none appearance-none">
                    <option value="PAGADO">PAGADO</option>
                    <option value="PENDIENTE">PENDIENTE</option>
                    <option value="VENCIDO">VENCIDO</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-zinc-500 mb-2">Método</label>
                  <input name="method" type="text" placeholder="Transferencia..." className="w-full rounded-xl border border-white/10 bg-black py-3 px-4 text-white focus:border-amber-500 focus:outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-zinc-500 mb-2">Observaciones</label>
                <input name="observations" type="text" className="w-full rounded-xl border border-white/10 bg-black py-3 px-4 text-white focus:border-amber-500 focus:outline-none" />
              </div>

              <button disabled={isSubmitting} type="submit" className="w-full rounded-xl bg-white hover:bg-zinc-200 py-4 text-sm font-black text-black uppercase tracking-widest transition-colors mt-4">
                {isSubmitting ? 'Guardando...' : 'Guardar Pago'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {isEditModalOpen && paymentToEdit && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-8 w-full max-w-md shadow-[0_0_100px_rgba(59,130,246,0.15)]">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-white">Editar Pago</h2>
              <button onClick={() => { setIsEditModalOpen(false); setPaymentToEdit(null); }} className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleEdit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-zinc-500 mb-2">Fecha</label>
                  <input required defaultValue={new Date(paymentToEdit.date).toISOString().split('T')[0]} name="date" type="date" className="w-full rounded-xl border border-white/10 bg-black py-3 px-4 text-white focus:border-blue-500 focus:outline-none [color-scheme:dark]" />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-zinc-500 mb-2">Monto ($)</label>
                  <input required defaultValue={paymentToEdit.amount} name="amount" type="number" step="0.01" className="w-full rounded-xl border border-white/10 bg-black py-3 px-4 text-white focus:border-blue-500 focus:outline-none" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-zinc-500 mb-2">Estado</label>
                  <select required defaultValue={paymentToEdit.status} name="status" className="w-full rounded-xl border border-white/10 bg-black py-3 px-4 text-white focus:border-blue-500 focus:outline-none appearance-none">
                    <option value="PAGADO">PAGADO</option>
                    <option value="PENDIENTE">PENDIENTE</option>
                    <option value="VENCIDO">VENCIDO</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-zinc-500 mb-2">Método</label>
                  <input defaultValue={paymentToEdit.method || ''} name="method" type="text" className="w-full rounded-xl border border-white/10 bg-black py-3 px-4 text-white focus:border-blue-500 focus:outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-zinc-500 mb-2">Observaciones</label>
                <input defaultValue={paymentToEdit.observations || ''} name="observations" type="text" className="w-full rounded-xl border border-white/10 bg-black py-3 px-4 text-white focus:border-blue-500 focus:outline-none" />
              </div>

              <button disabled={isSubmitting} type="submit" className="w-full rounded-xl bg-white hover:bg-zinc-200 py-4 text-sm font-black text-black uppercase tracking-widest transition-colors mt-4">
                {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </form>
          </div>
        </div>
      )}

    </>
  )
}
