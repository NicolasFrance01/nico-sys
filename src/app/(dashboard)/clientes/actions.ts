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
    return { success: true }
  } catch (error) {
    return { success: false, error: "No se pudo eliminar el cliente." }
  }
}

export async function createClient(name: string) {
  try {
    const client = await prisma.client.create({
      data: { name }
    })
    revalidatePath('/')
    revalidatePath('/clientes')
    return { success: true, data: client }
  } catch (error) {
    return { success: false, error: "No se pudo crear el cliente." }
  }
}
