import { prisma } from "@/lib/prisma"
import { calculatePaymentStatus } from "@/lib/payments"
import { SystemsTable } from "./components/SystemsTable"

export const revalidate = 0

export default async function SistemasPage() {
  const systemsRaw = await prisma.system.findMany({
    include: {
      client: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  const initialData = systemsRaw.map(sys => ({
    id: sys.id,
    name: sys.name,
    type: sys.type,
    subtype: sys.subtype,
    env: sys.env,
    status: sys.status,
    clientName: sys.client?.name || null,
    nextPaymentDate: sys.nextPaymentDate,
    paymentStatus: calculatePaymentStatus(sys.nextPaymentDate)
  }))

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-500">
            Ecosistema.
          </h1>
          <p className="mt-4 text-lg text-zinc-400 max-w-xl">
            Gestión detallada de sistemas. Busca, filtra y administra toda tu infraestructura desplegada.
          </p>
        </div>
      </div>

      <SystemsTable initialData={initialData} />
    </div>
  )
}
