const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function check() {
  const users = await prisma.user.findMany();
  console.log('Users in DB:', users.length);
  if (users.length > 0) {
    console.log('User email:', users[0].email);
  }
  process.exit(0);
}
check();
