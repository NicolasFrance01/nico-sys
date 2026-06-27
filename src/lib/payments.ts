export type CalculatedPaymentStatus = 'AL_DIA' | 'POR_COBRAR' | 'COBRAR'

export function calculatePaymentStatus(nextPaymentDate: Date | null): CalculatedPaymentStatus {
  if (!nextPaymentDate) {
    return 'AL_DIA' // Default si no tiene configurada una fecha
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const paymentDate = new Date(nextPaymentDate)
  paymentDate.setHours(0, 0, 0, 0)

  // Diferencia en ms
  const diffTime = paymentDate.getTime() - today.getTime()
  // Diferencia en días
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays <= 0) {
    return 'COBRAR' // Rojo
  }
  if (diffDays <= 7) {
    return 'POR_COBRAR' // Amarillo
  }
  return 'AL_DIA' // Verde
}
