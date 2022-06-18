import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {

  // await prisma.user.create({
  //   data: {
  //     name: 'Alice',
  //     email: 'alice@prisma.io',
  //     posts: {
  //       create: { title: 'Hello World' },
  //     },
  //     profile: {
  //       create: { bio: 'I like turtles' },
  //     },
  //   },
  // })

  const post = await prisma.post.update({
    where: { id: 1 },
    data: { published: true },
  })
  console.log('post', post)

  // ... you will write your Prisma Client queries here
  const allUsers = await prisma.user.findMany()
  console.log('allUsers', allUsers)
}

main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })