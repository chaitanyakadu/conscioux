import { Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from 'generated/prisma/runtime/library.js';
const prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs> = new PrismaClient();
export default prisma;