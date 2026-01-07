import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
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


});
