import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { FloatingSidebar } from "@/components/layout/FloatingSidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  
  if (!session) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 font-sans selection:bg-violet-500/30 overflow-x-hidden">
      {/* Luces y fondo ambiental global */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-violet-600/10 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[60%] bg-cyan-600/10 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
      </div>
      
      <FloatingSidebar userName={session.user?.name || "Usuario"} />
      
      <main className="relative z-10 ml-[100px] min-h-screen p-8 lg:p-12 transition-all">
        {children}
      </main>
    </div>
  )
}
