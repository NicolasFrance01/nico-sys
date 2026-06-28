"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { encrypt } from "@/lib/encryption"

export async function addCredential(systemId: string, data: { name: string, username: string | null, password: string }) {
  try {
    const encryptedPassword = encrypt(data.password)

    await prisma.credential.create({
      data: {
        name: data.name,
        username: data.username,
        password: encryptedPassword,
        systemId
      }
    })
    revalidatePath(`/sistemas/${systemId}`)
    return { success: true }
  } catch (error) {
    return { success: false, error: "Error al agregar credencial" }
  }
}

export async function deleteCredential(id: string, systemId: string) {
  try {
    await prisma.credential.delete({ where: { id } })
    revalidatePath(`/sistemas/${systemId}`)
    return { success: true }
  } catch (error) {
    return { success: false, error: "Error al eliminar credencial" }
  }
}
