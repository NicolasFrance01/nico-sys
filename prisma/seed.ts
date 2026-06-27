import { PrismaClient, SystemType, SystemEnv, SystemStatus, PaymentStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import 'dotenv/config'

import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)

const prisma = new PrismaClient({ adapter })

// Importamos o copiamos la logica de encriptacion aqui para asegurar que funciona en el script standalone
const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 16

const getMasterKey = () => {
  const key = process.env.MASTER_KEY
  if (!key || key.length !== 32) {
    throw new Error('MASTER_KEY must be exactly 32 characters long.')
  }
  return key
}

export const encrypt = (text: string): string => {
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(getMasterKey()), iv)
  
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  
  const authTag = cipher.getAuthTag().toString('hex')
  
  return `${iv.toString('hex')}:${authTag}:${encrypted}`
}

async function main() {
  console.log('Borrando datos existentes...')
  await prisma.paymentHistory.deleteMany()
  await prisma.credential.deleteMany()
  await prisma.systemUrl.deleteMany()
  await prisma.system.deleteMany()
  await prisma.client.deleteMany()
  await prisma.user.deleteMany()

  console.log('Creando usuario administrador...')
  const adminPassword = await bcrypt.hash('Ndf010399', 10)
  await prisma.user.create({
    data: {
      username: 'nfrance',
      password: adminPassword,
      role: 'ADMIN',
    }
  })

  console.log('Creando clientes...')
  const rodmell = await prisma.client.create({ data: { name: 'Rodmell' } })
  const fusionFitness = await prisma.client.create({ data: { name: 'Fusion Fitness' } })
  const edifica = await prisma.client.create({ data: { name: 'EDIFICA' } })
  const lega = await prisma.client.create({ data: { name: 'LEGA' } })
  const koach = await prisma.client.create({ data: { name: 'KO\'ACH' } })

  console.log('Creando Sistemas...')

  // 1. Vasito Club
  await prisma.system.create({
    data: {
      name: 'Vasito Club',
      type: SystemType.PROPIO,
      env: SystemEnv.TEST_NICO,
      status: SystemStatus.ACTIVO,
      urls: { create: { name: 'App', url: 'https://vasito-club.vercel.app/' } },
      credentials: { create: { name: 'Admin', username: 'admin', password: encrypt('Ndf41847034@') } }
    }
  })

  // 2. Mesa QR
  await prisma.system.create({
    data: {
      name: 'Mesa QR',
      type: SystemType.PROPIO,
      env: SystemEnv.TEST_NICO,
      status: SystemStatus.ACTIVO,
      urls: { create: { name: 'App', url: 'https://mesaqr-eta.vercel.app/' } }
    }
  })

  // 3. RODMELL
  await prisma.system.create({
    data: {
      name: 'RODMELL',
      type: SystemType.CLIENTE,
      env: SystemEnv.PROD,
      status: SystemStatus.ACTIVO,
      clientId: rodmell.id,
      nextPaymentDate: new Date('2026-07-20T00:00:00Z'),
      urls: {
        create: [
          { name: 'App', url: 'https://rodmell.vercel.app/' },
          { name: 'Dashboard', url: 'https://rodmell.vercel.app/dashboard' }
        ]
      },
      credentials: {
        create: [
          { name: 'App', username: 'master', password: encrypt('Ndf010399') },
          { name: 'Correo', username: 'rodmellautomotores@gmail.com', password: encrypt('sanmartin51') }
        ]
      },
      payments: {
        create: {
          date: new Date('2026-06-20T00:00:00Z'),
          amount: 0,
          method: 'Transferencia',
          status: PaymentStatus.PAGADO,
          observations: 'Pago inicial automático desde seed'
        }
      }
    }
  })

  // 4. Fusion Fitness
  await prisma.system.create({
    data: {
      name: 'Fusion Fitness',
      type: SystemType.CLIENTE,
      subtype: 'Atlascore',
      env: SystemEnv.PROD,
      status: SystemStatus.ACTIVO,
      clientId: fusionFitness.id,
      urls: { create: { name: 'Admin', url: 'https://fitnessfusiongym.vercel.app/admin' } },
      credentials: {
        create: [
          { name: 'Admin', username: 'admin', password: encrypt('admin123') },
          { name: 'Correo', username: 'fusionfitnesscruzdeleje@gmail.com', password: encrypt('p3p3490$10') }
        ]
      }
    }
  })

  // 5. EDIFICA
  await prisma.system.create({
    data: {
      name: 'EDIFICA',
      type: SystemType.CLIENTE,
      env: SystemEnv.PROD,
      status: SystemStatus.ACTIVO,
      clientId: edifica.id,
      urls: {
        create: [
          { name: 'Landing', url: 'https://www.edifica.net.ar' },
          { name: 'Dashboard', url: 'https://edifica-web-one.vercel.app/#/superuser/dashboard' },
          { name: 'AI Worker', url: 'https://edifica-aiworker.vercel.app/' }
        ]
      },
      credentials: {
        create: [
          { name: 'Superuser', username: 'eromera', password: encrypt('romera2026') },
          { name: 'Admin AI Worker', username: 'admin', password: encrypt('Ndf41847034@') },
          { name: 'Correo', username: 'edificasys@gmail.com', password: encrypt('eromera2026+') }
        ]
      }
    }
  })

  // 6. LEGA
  await prisma.system.create({
    data: {
      name: 'LEGA',
      type: SystemType.CLIENTE,
      env: SystemEnv.PROD,
      status: SystemStatus.ACTIVO,
      clientId: lega.id,
      nextPaymentDate: new Date('2026-07-01T00:00:00Z'),
      urls: {
        create: [
          { name: 'App', url: 'https://laboratoriolega.vercel.app' },
          { name: 'Resultados', url: 'https://laboratoriolega.vercel.app/resultado' }
        ]
      },
      credentials: {
        create: [
          { name: 'Admin', username: 'admin', password: encrypt('Ndf41847034@') },
          { name: 'Correo', username: 'laboratoriolega@gmail.com', password: encrypt('Carmina2013') }
        ]
      },
      payments: {
        create: [
          { date: new Date('2026-04-01T00:00:00Z'), amount: 0, method: 'Transferencia', status: PaymentStatus.PAGADO },
          { date: new Date('2026-05-01T00:00:00Z'), amount: 0, method: 'Transferencia', status: PaymentStatus.PAGADO },
          { date: new Date('2026-06-01T00:00:00Z'), amount: 0, method: 'Transferencia', status: PaymentStatus.PAGADO }
        ]
      }
    }
  })

  // 7. KO'ACH
  await prisma.system.create({
    data: {
      name: 'KO\'ACH',
      type: SystemType.CLIENTE,
      env: SystemEnv.TEST_NICO,
      status: SystemStatus.ACTIVO,
      clientId: koach.id,
      urls: { create: { name: 'App', url: 'https://koach-gym.vercel.app' } },
      credentials: { create: { name: 'Admin', username: 'master', password: encrypt('Ndf010399') } }
    }
  })

  // 8. AppStatus
  await prisma.system.create({
    data: {
      name: 'AppStatus',
      type: SystemType.ALGEIBA,
      env: SystemEnv.TEST_NICO,
      status: SystemStatus.ACTIVO,
      urls: { create: { name: 'App', url: 'https://app-status-green.vercel.app/' } },
      credentials: { create: { name: 'Admin', username: 'nfrance', password: encrypt('Ndf41847034@') } }
    }
  })

  // 9. DocChat
  await prisma.system.create({
    data: {
      name: 'DocChat',
      type: SystemType.ALGEIBA,
      env: SystemEnv.TEST_NICO,
      status: SystemStatus.ACTIVO,
      urls: { create: { name: 'Login', url: 'https://doc-chat-silk-nine.vercel.app/login' } },
      credentials: { create: { name: 'Admin', username: 'master', password: encrypt('Ndf41847034@') } }
    }
  })

  // 10. Minutai
  await prisma.system.create({
    data: {
      name: 'Minutai',
      type: SystemType.ALGEIBA,
      env: SystemEnv.TEST_NICO,
      status: SystemStatus.ACTIVO,
      urls: { create: { name: 'App', url: 'https://minutai.vercel.app/' } },
      credentials: {
        create: [
          { name: 'Master', username: 'master', password: encrypt('Ndf010399') },
          { name: 'Admin', username: 'nfrance', password: encrypt('Ndf010399') }
        ]
      }
    }
  })

  // 11. Patching
  await prisma.system.create({
    data: {
      name: 'Patching',
      type: SystemType.ALGEIBA,
      env: SystemEnv.TEST_NICO,
      status: SystemStatus.ACTIVO,
      urls: { create: { name: 'App', url: 'https://algeibapatching.vercel.app/' } },
      credentials: { create: { name: 'Admin', username: 'admin', password: encrypt('Ndf41847034@') } }
    }
  })

  console.log('Seed completado satisfactoriamente!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
