import { initTRPC } from "@trpc/server" //inicializando o servidor
const t = initTRPC.create();

export const router = t.router;
export const publicProcedure = t.procedure;