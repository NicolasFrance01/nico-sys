"use server"

import { prisma } from "@/lib/prisma"
import { decrypt } from "@/lib/encryption"

export async function revealPassword(credentialId: string, pin: string) {
  if (pin !== "010399") {
    return { success: false, error: "Clave maestra incorrecta" }
  }

  try {
    const cred = await prisma.credential.findUnique({
      where: { id: credentialId }
    })

    if (!cred) {
      return { success: false, error: "Credencial no encontrada" }
    }

    const plainText = decrypt(cred.password)
    return { success: true, data: plainText }
  } catch (error) {
    return { success: false, error: "Error al descifrar la contraseña" }
  }
}
