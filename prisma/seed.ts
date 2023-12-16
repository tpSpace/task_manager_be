import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

const userData: Prisma.UserCreateInput[] = [
  {
    email: 'admin1@gmail.com',
    password: 'MyP@ssw0rd!',
    name: 'liem',
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    email: 'lmao@gmail.com',
    password: 'MyP@ssw0rd!',
    name: 'JAck',
    avatar: 'https://www.alleycat.org/wp-content/uploads/2019/03/FELV-cat.jpg',
  },
  {
    email: 'murmur@gmail.com',
    password: 'MyP@ssw0rd!',
    name: 'Murmur',
    avatar: 'https://images.unsplash.com/photo-1608848461950-0fe51dfc41cb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8fA%3D%3D',
  }
];

async function main() {
  console.log(`Start seeding ...`);
  for (const u of userData) {
    const user = await prisma.user.create({
      data: u,
    });
    console.log(`Created user with id: ${user.id}`);
  }
  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
