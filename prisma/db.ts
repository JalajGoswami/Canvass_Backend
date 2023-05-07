import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient;
}

if (!global.prisma)
    global.prisma = new PrismaClient()
    
const db = global.prisma

export default db