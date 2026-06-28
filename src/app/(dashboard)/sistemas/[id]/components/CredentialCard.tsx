"use client"

import { useState } from "react"
import { Lock, Mail, Eye } from "lucide-react"

export function CredentialCard({ cred }: { cred: { id: string, name: string, username: string | null, password: string } }) {
  const [isRevealed, setIsRevealed] = useState(false)

  const handleReveal = () => {
    if (isRevealed) {
      setIsRevealed(false)
      return
    }

    const master = window.prompt("Ingrese la clave maestra para revelar esta credencial:")
    if (master === "010399") {
      setIsRevealed(true)
    } else if (master !== null) {
      alert("Clave maestra incorrecta.")
    }
  }

  const isMail = cred.name.toLowerCase().includes('mail') || cred.name.toLowerCase().includes('correo')

  return (
    <div className="p-6 rounded-2xl bg-zinc-900/30 border border-white/5 relative overflow-hidden group">
      {/* Efecto de borde */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500/50" />
      
      <h3 className="text-white font-bold mb-4 flex items-center gap-2">
        {isMail ? <Mail size={16} className="text-zinc-400" /> : <Lock size={16} className="text-zinc-400" />}
        {cred.name}
      </h3>
      
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
              Contraseña <Eye size={10} className="opacity-50" />
            </p>
            <p className="text-emerald-400 font-mono text-sm tracking-widest">
              {isRevealed ? cred.password : "••••••••••••••••"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
