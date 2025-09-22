import { PrismaClient } from '@prisma/client';

// Declara uma variável global para armazenar a instância do Prisma
declare global {
  var prisma: PrismaClient | undefined;
}

// Cria uma instância do PrismaClient, reutilizando a instância global se ela já existir.
// Em produção, a cada invocação serverless, uma nova instância é criada.
// Em desenvolvimento, a instância global é reutilizada para evitar o esgotamento de conexões
// devido ao hot-reloading do Next.js.
const client = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalThis.prisma = client;

export default client;
