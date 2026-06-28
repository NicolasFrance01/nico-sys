"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function deleteClient(id: string) {
  try {
    await prisma.client.delete({
      where: { id }
    })
    revalidatePath('/')
    revalidatePath('/clientes')
    revalidatePath('/sistemas')
    return { success: true }
  } catch (error) {
    return { success: false, error: "No se pudo eliminar el cliente." }
  }
}

export async function createClient(name: string, systemIds: string[] = []) {
  try {
    const client = await prisma.client.create({
      data: { 
        name,
        systems: {
          connect: systemIds.map(id => ({ id }))
        }
      }
    })
    revalidatePath('/')
    revalidatePath('/clientes')
    revalidatePath('/sistemas')
    return { success: true, data: client }
  } catch (error) {
    return { success: false, error: "No se pudo crear el cliente." }
  }
}

export async function updateClient(id: string, name: string, systemIds: string[] = []) {
  try {
    // Primero, desconectamos todos los sistemas actuales que tiene este cliente
    // (Para no arrastrar basura, o podemos simplemente usar `set`)
    const client = await prisma.client.update({
      where: { id },
      data: {
        name,
        systems: {
          set: systemIds.map(sysId => ({ id: sysId }))
        }
      }
    })
    revalidatePath('/')
    revalidatePath('/clientes')
    revalidatePath('/sistemas')
    return { success: true, data: client }
  } catch (error) {
    return { success: false, error: "No se pudo actualizar el cliente." }
  }
}
