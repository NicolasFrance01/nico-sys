"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function addUrl(systemId: string, data: { name: string, url: string }) {
  try {
    await prisma.systemUrl.create({
      data: {
        name: data.name,
        url: data.url,
        systemId
      }
    })
    revalidatePath(`/sistemas/${systemId}`)
    return { success: true }
  } catch (error) {
    return { success: false, error: "Error al agregar URL" }
  }
}

export async function deleteUrl(id: string, systemId: string) {
  try {
    await prisma.systemUrl.delete({ where: { id } })
    revalidatePath(`/sistemas/${systemId}`)
    return { success: true }
  } catch (error) {
    return { success: false, error: "Error al eliminar URL" }
  }
}
