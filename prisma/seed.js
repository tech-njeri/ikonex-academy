const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const password = await bcrypt.hash('admin1234', 10)

  const user = await prisma.user.upsert({
    where: { email: 'admin@ikonex.ac.ke' },
    update: {},
    create: {
      email: 'admin@ikonex.ac.ke',
      name: 'Admin',
      password,
    },
  })

  console.log('Seeded user:', user.email)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())