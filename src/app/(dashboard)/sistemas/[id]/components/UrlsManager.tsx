"use client"

import { useState } from "react"
import { Globe, Plus, Trash2, ExternalLink, X } from "lucide-react"
import { addUrl, deleteUrl } from "../urls-actions"

type UrlData = {
  id: string
  name: string
  url: string
}

export function UrlsManager({ systemId, initialUrls }: { systemId: string, initialUrls: UrlData[] }) {
  const [urls, setUrls] = useState(initialUrls)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar esta URL?")) return
    const res = await deleteUrl(id, systemId)
    if (res.success) {
      setUrls(urls.filter(u => u.id !== id))
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
      url: formData.get("url") as string
    }
    const res = await addUrl(systemId, data)
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
          <Globe className="text-blue-400" size={24} />
          <h2 className="text-2xl font-bold text-white">URLs del Sistema</h2>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 transition-colors">
          <Plus size={18} />
        </button>
      </div>
      
      <div className="space-y-4">
        {urls.length > 0 ? (
          urls.map(url => (
            <div key={url.id} className="group relative flex items-center justify-between p-5 rounded-2xl bg-zinc-900/30 border border-white/5 hover:bg-zinc-800/50 hover:border-white/10 transition-all">
              <a href={url.url} target="_blank" rel="noopener noreferrer" className="flex-1 overflow-hidden pr-4">
                <p className="text-white font-semibold">{url.name}</p>
                <p className="text-blue-400 font-mono text-sm mt-1 group-hover:underline flex items-center gap-2 truncate">
                  {url.url} <ExternalLink size={12} className="opacity-50 flex-shrink-0" />
                </p>
              </a>
              <button 
                onClick={() => handleDelete(url.id)} 
                className="p-2 rounded-xl bg-red-500/10 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20 ml-4 flex-shrink-0"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        ) : (
          <div className="p-6 rounded-2xl bg-zinc-900/10 border border-white/5 border-dashed text-center">
            <p className="text-zinc-600 font-mono text-sm uppercase tracking-widest">No hay URLs registradas.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-8 w-full max-w-md shadow-[0_0_100px_rgba(59,130,246,0.15)] relative">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-white">Agregar URL</h2>
              <button type="button" onClick={() => setIsModalOpen(false)} className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAdd} className="space-y-6">
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-zinc-500 mb-2">Nombre</label>
                <input required name="name" type="text" placeholder="Ej. Producción, API..." className="w-full rounded-xl border border-white/10 bg-black py-3 px-4 text-white focus:border-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-zinc-500 mb-2">URL</label>
                <input required name="url" type="url" placeholder="https://..." className="w-full rounded-xl border border-white/10 bg-black py-3 px-4 text-white focus:border-blue-500 focus:outline-none" />
              </div>
              <button disabled={isSubmitting} type="submit" className="w-full rounded-xl bg-white hover:bg-zinc-200 py-4 text-sm font-black text-black uppercase tracking-widest transition-colors mt-4">
                {isSubmitting ? 'Guardando...' : 'Guardar URL'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
