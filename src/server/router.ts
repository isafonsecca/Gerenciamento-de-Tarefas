import { publicProcedure, router } from "./trpc";
import { z } from "zod";
import { taskSchema, Task } from "./schema";
import { nanoid } from "nanoid"; 

//taks iniciais
let tasks: Task[] = [
  { id: "1", title: "Organizar escrivaninha", description: "Não esquecer de jogar fora o que não uso mais", completed: false, dataCriacao: new Date()},
  { id: "2", title: "Estudar para teste final", description: " Estudar com base no material do professor", completed: true, dataCriacao: new Date()},
];

export const appRouter = router({
  getTasks: publicProcedure.query(() => tasks),
  createTask: publicProcedure
    .input(taskSchema.omit({ id: true }))
    .mutation(({ input }) => {
      const newTask: Task = { id: nanoid(), ...input, dataCriacao: new Date()};
      tasks.push(newTask);
      return newTask;
    }),
    updateTask: publicProcedure
    .input(z.object({
      id: z.string(),
      title: z.string().optional(),
      description:  z.string().optional(),
      completed: z.boolean().optional(),
      dataCriacao: z.union([z.date(), z.string()]).transform((val) => new Date(val)),
    }))
    .mutation(({ input }) => {
      const task = tasks.find((t) => t.id === input.id);
      if (task) {
        if (input.title !== undefined) task.title = input.title;
        if (input.description !== undefined) task.description = input.description;
        if (input.completed !== undefined) task.completed = input.completed;
        task.dataCriacao = new Date(input.dataCriacao);
    }
      return task;
    }),
  deleteTask: publicProcedure.input(z.string()).mutation(({ input }) => {
    tasks = tasks.filter((t) => t.id !== input);
    return { success: true };
  }),
});

export type AppRouter = typeof appRouter;
