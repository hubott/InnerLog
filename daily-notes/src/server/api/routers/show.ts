import { get } from "http";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const ShowRouter = createTRPCRouter({
    create: protectedProcedure
    .input(z.object({ title: z.string().min(1), }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.show.create({
        data: {
            name: input.title,

            user: { connect: { id: ctx.session.user.id } },
        },
      });
    }
    ),
    getShows: protectedProcedure.query(async ({ ctx }) => {
        return ctx.db.show.findMany({
            where: { user: { id: ctx.session.user.id } },
        });
    }),
    getShowById: protectedProcedure
    .input(z.object({ showId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
        return ctx.db.show.findUnique({
            where: { id: input.showId },
        });
    }),
});