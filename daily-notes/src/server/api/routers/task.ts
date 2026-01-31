import { z } from "zod";
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
});