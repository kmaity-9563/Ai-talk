import { PrismaClient} from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  try {
    // Seed users
    const alice = await prisma.user.upsert({
      where: { email: 'alice@example.com' },
      update: {},
      create: {
        email: 'alice@example.com',
        username : 'alice',
        password: await bcrypt.hash('alice', 10),
        isVerified: false,
        verifyCode : '100',
        isAcceptingMessage: true,
        tokenDateExpiry: new Date(), // Add tokenDateExpiry field
        messages: {
          create: [
            { content: 'Hello from Alice!' },
            { content: 'Another message from Alice!' },
          ],
        },
      },
      include: { messages: true },
    });

    const bob = await prisma.user.upsert({
      where: { email: 'bob@example.com' },
      update: {},
      create: {
        email: 'bob@example.com',
        username : 'bob',
        password: await bcrypt.hash('bob', 10),
        isVerified: false,
        verifyCode : '200',
        isAcceptingMessage: true,
        tokenDateExpiry: new Date(), // Add tokenDateExpiry field
        messages: {
          create: [
            { content: 'Hello from Bob!' },
            { content: 'Another message from Bob!' },
          ],
        },
      },
      include: { messages: true },
    });

    console.log('Seeding completed successfully!');
    console.log({ alice, bob });
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
