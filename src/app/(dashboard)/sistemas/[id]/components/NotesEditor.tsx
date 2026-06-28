"use client"

import { useState } from "react"
import { Edit2, Check, X, Loader2 } from "lucide-react"
import { updateSystemNotes } from "../payment-actions"

export function NotesEditor({ systemId, initialDescription, initialNotes }: { systemId: string, initialDescription: string | null, initialNotes: string | null }) {
  const [isEditing, setIsEditing] = useState(false)
  const [description, setDescription] = useState(initialDescription || "")
  const [notes, setNotes] = useState(initialNotes || "")
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    const res = await updateSystemNotes(systemId, description || null, notes || null)
    setIsSaving(false)
    if (res.success) {
      setIsEditing(false)
    } else {
      alert(res.error)
    }
  }

  if (isEditing) {
    return (
      <div className="rounded-3xl bg-zinc-900/50 border border-emerald-500/30 p-8 backdrop-blur-md space-y-6 relative">
        <div className="absolute top-4 right-4 flex gap-2">
          <button onClick={() => setIsEditing(false)} className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition-colors" disabled={isSaving}>
            <X size={18} />
          </button>
          <button onClick={handleSave} className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors flex items-center justify-center min-w-[36px]" disabled={isSaving}>
            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
          </button>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-widest text-zinc-500 mb-2">Descripción Pública</label>
          <textarea 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/50 py-3 px-4 text-white focus:border-emerald-500 focus:outline-none min-h-[100px] leading-relaxed"
            placeholder="Descripción general del sistema..."
          />
        </div>

        <div className="pt-4 border-t border-white/5">
          <label className="block text-xs font-mono uppercase tracking-widest text-zinc-500 mb-2">Notas Internas (Técnicas)</label>
          <textarea 
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/50 py-3 px-4 text-zinc-400 focus:border-emerald-500 focus:outline-none font-mono text-sm min-h-[150px]"
            placeholder="Comandos, configuraciones SSH, notas privadas..."
          />
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-3xl bg-zinc-900/30 border border-white/5 p-8 backdrop-blur-md group relative">
      <button 
        onClick={() => setIsEditing(true)}
        className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-blue-500/20 text-zinc-400 hover:text-blue-400 transition-colors opacity-0 group-hover:opacity-100"
        title="Editar Descripción"
      >
        <Edit2 size={18} />
      </button>

      {description || notes ? (
        <div className="space-y-6 text-zinc-300 pr-12">
          {description && <p className="leading-relaxed">{description}</p>}
          {notes && (
            <div className="pt-6 border-t border-white/5">
              <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest mb-3">Notas Internas</p>
              <p className="font-mono text-sm text-zinc-400 leading-relaxed whitespace-pre-wrap">{notes}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="py-4 text-center">
          <p className="text-zinc-600 font-mono text-sm uppercase tracking-widest">Sin información detallada.</p>
        </div>
      )}
    </div>
  )
}
