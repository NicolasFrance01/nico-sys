"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { PaymentStatus } from "@prisma/client"

export async function createPayment(systemId: string, data: {
  date: Date
  amount: number
  method?: string
  status: PaymentStatus
  observations?: string
}) {
  try {
    const payment = await prisma.paymentHistory.create({
      data: {
        systemId,
        date: data.date,
        amount: data.amount,
        method: data.method || null,
        status: data.status,
        observations: data.observations || null
      }
    })
    revalidatePath(`/sistemas/${systemId}`)
    return { success: true, data: payment }
  } catch (error) {
    return { success: false, error: "No se pudo registrar el pago." }
  }
}

export async function updatePayment(id: string, data: {
  date: Date
  amount: number
  method?: string
  status: PaymentStatus
  observations?: string
}, systemId: string) {
  try {
    const payment = await prisma.paymentHistory.update({
      where: { id },
      data: {
        date: data.date,
        amount: data.amount,
        method: data.method || null,
        status: data.status,
        observations: data.observations || null
      }
    })
    revalidatePath(`/sistemas/${systemId}`)
    return { success: true, data: payment }
  } catch (error) {
    return { success: false, error: "No se pudo actualizar el pago." }
  }
}

export async function deletePayment(id: string, systemId: string) {
  try {
    await prisma.paymentHistory.delete({
      where: { id }
    })
    revalidatePath(`/sistemas/${systemId}`)
    return { success: true }
  } catch (error) {
    return { success: false, error: "No se pudo eliminar el pago." }
  }
}

export async function updateSystemNotes(id: string, description: string | null, notes: string | null) {
  try {
    const sys = await prisma.system.update({
      where: { id },
      data: {
        description,
        notes
      }
    })
    revalidatePath(`/sistemas/${id}`)
    return { success: true, data: sys }
  } catch (error) {
    return { success: false, error: "No se pudieron actualizar las notas." }
  }
}
