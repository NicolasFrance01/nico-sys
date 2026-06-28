"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { SystemType, SystemEnv, SystemStatus } from "@prisma/client"

export async function deleteSystem(id: string) {
  try {
    await prisma.system.delete({
      where: { id }
    })
    revalidatePath('/')
    revalidatePath('/sistemas')
    return { success: true }
  } catch (error) {
    return { success: false, error: "No se pudo eliminar el sistema." }
  }
}

export async function createSystem(data: {
  name: string
  type: SystemType
  env: SystemEnv
  status: SystemStatus
  clientId?: string | null
  nextPaymentDate?: Date | null
}) {
  try {
    const sys = await prisma.system.create({
      data: {
        name: data.name,
        type: data.type,
        env: data.env,
        status: data.status,
        clientId: data.clientId || null,
        nextPaymentDate: data.nextPaymentDate || null
      }
    })
    revalidatePath('/')
    revalidatePath('/sistemas')
    return { success: true, data: sys }
  } catch (error) {
    return { success: false, error: "No se pudo crear el sistema." }
  }
}

// Para editar, simplemente pasaremos un ID y los mismos datos.
// Pero la vista dinámica `/sistemas/[id]` requerirá su propia página.
