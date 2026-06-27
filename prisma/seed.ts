import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import 'dotenv/config'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
})

async function main() {
  const password = await bcrypt.hash('Ndf010399', 10)
  
  const user = await prisma.user.upsert({
    where: { username: 'nfrance' },
    update: {},
    create: {
      username: 'nfrance',
      password,
      role: 'ADMIN',
    },
  })
  
  console.log('Seed completed successfully:')
  console.log(user)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
