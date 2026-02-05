import { set, z } from "zod";
import { Priority, Status } from "~/../generated/prisma";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const TaskRouter = createTRPCRouter({
    create: protectedProcedure
    .input(z.object({ title: z.string().min(1), priority: z.nativeEnum(Priority).optional(), dueDate: z.date().optional(), status: z.nativeEnum(Status).optional() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.task.create({
        data: {
            title: input.title,
            priority: input.priority,
            creationDate: new Date(),
            dueDate: input.dueDate,
            status: input.status,
            user: { connect: { id: ctx.session.user.id } },
        },
      });
    }
    ),
    getTasks: protectedProcedure.query(async ({ ctx }) => {
        return ctx.db.task.findMany({
            where: { userId: ctx.session.user.id },
            orderBy: { creationDate: "desc" },
        });
    }
  ),
    setStatus: protectedProcedure
    .input(z.object({ taskId: z.string().min(1), status: z.nativeEnum(Status) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.task.update({
        where: { id: input.taskId },
        data: { status: input.status },
      });
    }
    ),
    setPriority: protectedProcedure
    .input(z.object({ taskId: z.string().min(1), priority: z.nativeEnum(Priority) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.task.update({
        where: { id: input.taskId },
        data: { priority: input.priority },
      });
    }
     ),
     deleteTask: protectedProcedure
     .input(z.object({ taskId: z.string().min(1) }))
     .mutation(async ({ ctx, input }) => {
       return ctx.db.task.delete({
         where: { id: input.taskId },
       });
     }
      ),
});