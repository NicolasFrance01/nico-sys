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
  type: string
  env: SystemEnv
  status: SystemStatus
  clientId?: string | null
  nextPaymentDate?: Date | null
}) {
  try {
    let actualType: SystemType = data.type as SystemType;
    let subtype: string | null = null;
    if (data.type === 'ATLASCORE') {
      actualType = SystemType.CLIENTE;
      subtype = 'Atlascore';
    }

    const sys = await prisma.system.create({
      data: {
        name: data.name,
        type: actualType,
        subtype: subtype,
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

export async function updateSystem(id: string, data: {
  name: string
  type: string
  env: SystemEnv
  status: SystemStatus
  clientId?: string | null
  nextPaymentDate?: Date | null
}) {
  try {
    let actualType: SystemType = data.type as SystemType;
    let subtype: string | null = null;
    if (data.type === 'ATLASCORE') {
      actualType = SystemType.CLIENTE;
      subtype = 'Atlascore';
    } else {
      // Si antes era Atlascore y ahora lo cambian a PROPIO, se borra el subtype.
      subtype = null;
    }

    const sys = await prisma.system.update({
      where: { id },
      data: {
        name: data.name,
        type: actualType,
        subtype: subtype,
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
    return { success: false, error: "No se pudo actualizar el sistema." }
  }
}
