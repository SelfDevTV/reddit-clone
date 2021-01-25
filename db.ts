import { PrismaClient, Prisma } from "@prisma/client";

let prisma: PrismaClient<Prisma.PrismaClientOptions>;
const globalAny: any = global;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!globalAny.prisma) {
    globalAny.prisma = new PrismaClient();
  }

  prisma = globalAny.prisma;
}

export default prisma;
