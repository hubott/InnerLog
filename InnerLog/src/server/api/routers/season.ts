import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const SeasonRouter = createTRPCRouter({
    create: protectedProcedure
    .input(z.object({ number: z.number().min(1), show: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.season.create({
        data: {
            number: input.number,
            show: { connect: { id: input.show } },
        },
      });
    }
    ),

    getSeasonsByShow: protectedProcedure
    .input(z.object({ showId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
        return ctx.db.season.findMany({
            where: { show: { id: input.showId } },
            orderBy: { number: "asc" },
        });
    }
    ),
    deleteSeason: protectedProcedure
    .input(z.object({ seasonId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
        return ctx.db.season.delete({
            where: { id: input.seasonId },
        });
    }
  ),
});