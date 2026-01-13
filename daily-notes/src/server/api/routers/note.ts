import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const NoteRouter = createTRPCRouter({


  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.note.create({
        data: {
          contents: input.name,
          user: { connect: { id: ctx.session.user.id } },
          date: new Date(),
        },
      });
    }),

    getUser: protectedProcedure.query(async ({ ctx }) => {
      const userId = ctx.session.user.id;
      return ctx.db.user.findUnique({
        where: { id: userId },
      });
    }),


});
