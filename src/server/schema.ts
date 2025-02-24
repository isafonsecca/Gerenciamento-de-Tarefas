import { z } from "zod";

export const taskSchema = z.object({
    id: z.string(),
    title: z.string().min(1),
    description: z.string().optional(),
    completed: z.boolean(),
    dataCriacao: z.string().transform((val) => new Date(val)), //transforma a string em data
});

export type Task = z.infer<typeof taskSchema>;