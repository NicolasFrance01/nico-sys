import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { User, Shield, Mail } from "lucide-react"

export default async function PerfilPage() {
  const session = await auth()
  
  if (!session) {
    redirect('/login')
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-20">
      
      <div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">Mi Perfil</h1>
        <p className="mt-2 text-zinc-400">Gestiona tu información personal y credenciales de acceso.</p>
      </div>

      <div className="rounded-2xl border border-white/5 bg-zinc-900/40 backdrop-blur-md p-8">
        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-white/5">
          <div className="h-24 w-24 rounded-full bg-zinc-800 border-2 border-violet-500/50 flex items-center justify-center overflow-hidden">
            <span className="text-3xl font-bold text-violet-400 uppercase">
              {session.user?.name?.slice(0, 2) || "NF"}
            </span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{session.user?.name || "Administrador"}</h2>
            <div className="flex items-center gap-2 mt-2 text-zinc-400">
              <Shield size={16} className="text-violet-400" />
              <span>Acceso Total (SuperAdmin)</span>
            </div>
          </div>
        </div>

        <form className="space-y-6">
          <div className="grid gap-2">
            <label className="text-sm font-medium text-zinc-300">Nombre de Usuario</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input 
                type="text" 
                defaultValue={session.user?.name || ""}
                disabled
                className="w-full rounded-xl border border-white/10 bg-zinc-950/50 py-2.5 pl-10 pr-4 text-sm text-zinc-400 opacity-70 cursor-not-allowed"
              />
            </div>
            <p className="text-xs text-zinc-500">El nombre de usuario actual no puede modificarse por seguridad.</p>
          </div>

          <div className="pt-4">
            <button type="button" className="rounded-xl bg-violet-600 hover:bg-violet-500 px-6 py-2.5 text-sm font-medium text-white transition-colors shadow-lg shadow-violet-500/20">
              Cambiar Contraseña
            </button>
          </div>
        </form>
      </div>

    </div>
  )
}
