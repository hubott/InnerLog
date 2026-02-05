import {  z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const EpisodeRouter = createTRPCRouter({
    create: protectedProcedure
    .input(z.object({ title: z.string().min(1), season: z.string().min(1), number: z.number(), thoughts: z.string().optional(), rating: z.number().min(0).max(10).optional() 

    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.episode.create({
        data: {
            title: input.title,
            season: { connect: { id: input.season } },
            number: input.number,
            thoughts: input.thoughts ?? "",
            rating: input.rating ?? 5,
        },
      });
    }
    ),

    getEpisodesBySeason: protectedProcedure
    .input(z.object({ seasonId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
        return ctx.db.episode.findMany({
            where: { season: { id: input.seasonId } },
            orderBy: { number: "asc" },
        });
    }
    ),
    
});