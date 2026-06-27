import { Server } from "lucide-react"

export default function SistemasPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-100">Sistemas</h1>
        <p className="mt-2 text-zinc-400">
          Administra todos tus sistemas y monitorea sus estados de pago.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-zinc-900/40 backdrop-blur-xl p-8 shadow-xl min-h-[500px] flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.1),transparent_70%)]" />
        <div className="text-center space-y-4 relative z-10">
          <div className="mx-auto w-16 h-16 rounded-full bg-white/5 flex items-center justify-center ring-1 ring-white/10 shadow-lg shadow-violet-500/10">
            <Server className="text-zinc-400" size={32} />
          </div>
          <h3 className="text-xl font-medium text-zinc-200">Tabla de Sistemas (Próximamente)</h3>
          <p className="text-sm text-zinc-500 max-w-sm mx-auto">
            Aquí integraremos la tabla interactiva con semáforos, filtros y acceso a las contraseñas.
          </p>
        </div>
      </div>
    </div>
  )
}
