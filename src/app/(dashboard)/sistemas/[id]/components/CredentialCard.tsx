"use client"

import { useState } from "react"
import { Lock, Mail, Eye, Loader2, Trash2 } from "lucide-react"
import { revealPassword } from "../actions"

export function CredentialCard({ cred, onDelete }: { cred: { id: string, name: string, username: string | null, password: string }, onDelete?: () => void }) {
  const [isRevealed, setIsRevealed] = useState(false)
  const [plainPassword, setPlainPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleReveal = async () => {
    if (isRevealed) {
      setIsRevealed(false)
      setPlainPassword("")
      return
    }

    const pin = window.prompt("Ingrese la clave maestra para revelar esta credencial:")
    if (!pin) return

    setIsLoading(true)
    const result = await revealPassword(cred.id, pin)
    setIsLoading(false)

    if (result.success && result.data) {
      setPlainPassword(result.data)
      setIsRevealed(true)
    } else {
      alert(result.error || "Clave maestra incorrecta o error al descifrar.")
    }
  }

  const isMail = cred.name.toLowerCase().includes('mail') || cred.name.toLowerCase().includes('correo')

  return (
    <div className="p-6 rounded-2xl bg-zinc-900/30 border border-white/5 relative overflow-hidden group">
      {/* Efecto de borde */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500/50" />
      
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-bold flex items-center gap-2">
          {isMail ? <Mail size={16} className="text-zinc-400" /> : <Lock size={16} className="text-zinc-400" />}
          {cred.name}
        </h3>
        {onDelete && (
          <button 
            onClick={onDelete}
            className="p-1.5 rounded-lg bg-red-500/10 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20"
            title="Eliminar credencial"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
      
      <div className="grid gap-3">
        <div className="flex items-center justify-between bg-black/40 rounded-xl p-3 border border-white/5">
          <div>
            <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest mb-1">Usuario / Email</p>
            <p className="text-zinc-200 font-mono text-sm">{cred.username || '-'}</p>
          </div>
        </div>
        <div 
          onClick={handleReveal}
          className="flex items-center justify-between bg-black/40 rounded-xl p-3 border border-white/5 cursor-pointer hover:bg-white/5 transition-colors group/pass"
        >
          <div>
            <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest mb-1 flex items-center gap-2">
              Contraseña {isLoading ? <Loader2 size={10} className="animate-spin text-blue-400" /> : <Eye size={10} className="opacity-50" />}
            </p>
            <p className="text-emerald-400 font-mono text-sm tracking-widest">
              {isRevealed ? plainPassword : "••••••••••••••••"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
