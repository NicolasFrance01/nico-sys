"use client"

import { useState } from "react"
import { Lock, Plus, X } from "lucide-react"
import { addCredential, deleteCredential } from "../credentials-actions"
import { CredentialCard } from "./CredentialCard"

type CredentialData = {
  id: string
  name: string
  username: string | null
  password: string
}

export function CredentialsManager({ systemId, initialCredentials }: { systemId: string, initialCredentials: CredentialData[] }) {
  const [credentials, setCredentials] = useState(initialCredentials)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar esta credencial?")) return
    const res = await deleteCredential(id, systemId)
    if (res.success) {
      setCredentials(credentials.filter(c => c.id !== id))
    } else {
      alert(res.error)
    }
  }

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get("name") as string,
      username: formData.get("username") as string || null,
      password: formData.get("password") as string
    }
    const res = await addCredential(systemId, data)
    if (res.success) {
      window.location.reload()
    } else {
      alert(res.error)
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Lock className="text-emerald-400" size={24} />
          <h2 className="text-2xl font-bold text-white">Credenciales</h2>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 transition-colors">
          <Plus size={18} />
        </button>
      </div>
      
      <div className="space-y-4">
        {credentials.length > 0 ? (
          credentials.map(cred => (
            <CredentialCard key={cred.id} cred={cred} onDelete={() => handleDelete(cred.id)} />
          ))
        ) : (
          <div className="p-6 rounded-2xl bg-zinc-900/10 border border-white/5 border-dashed text-center">
            <p className="text-zinc-600 font-mono text-sm uppercase tracking-widest">No hay credenciales registradas.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-8 w-full max-w-md shadow-[0_0_100px_rgba(16,185,129,0.15)] relative">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-white">Agregar Credencial</h2>
              <button type="button" onClick={() => setIsModalOpen(false)} className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAdd} className="space-y-6">
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-zinc-500 mb-2">Nombre / Entorno</label>
                <input required name="name" type="text" placeholder="Ej. Base de Datos, Admin Panel..." className="w-full rounded-xl border border-white/10 bg-black py-3 px-4 text-white focus:border-emerald-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-zinc-500 mb-2">Usuario / Email (Opcional)</label>
                <input name="username" type="text" placeholder="admin@..." className="w-full rounded-xl border border-white/10 bg-black py-3 px-4 text-white focus:border-emerald-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-zinc-500 mb-2">Contraseña</label>
                <input required name="password" type="text" placeholder="***" className="w-full rounded-xl border border-white/10 bg-black py-3 px-4 text-white focus:border-emerald-500 focus:outline-none" />
              </div>
              <button disabled={isSubmitting} type="submit" className="w-full rounded-xl bg-white hover:bg-zinc-200 py-4 text-sm font-black text-black uppercase tracking-widest transition-colors mt-4">
                {isSubmitting ? 'Guardando...' : 'Guardar Credencial'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
