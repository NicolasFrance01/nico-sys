import { prisma } from "@/lib/prisma"
import { ClientsTable } from "./components/ClientsTable"

export const revalidate = 0

export default async function ClientesPage() {
  const clientsRaw = await prisma.client.findMany({
    include: {
      systems: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  const initialData = clientsRaw.map(c => ({
    id: c.id,
    name: c.name,
    createdAt: c.createdAt,
    systemsCount: c.systems.length
  }))

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-20">
      
      {/* Header */}
      <div className="pt-12 mb-12">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-[1px] w-12 bg-emerald-500" />
          <p className="text-emerald-400 font-mono text-sm tracking-widest uppercase">Base de Datos CRM</p>
        </div>
        <h1 className="text-6xl md:text-7xl font-black tracking-tighter text-white leading-[0.9]">
          Directorio.
        </h1>
      </div>

      <ClientsTable initialData={initialData} />

    </div>
  )
}
