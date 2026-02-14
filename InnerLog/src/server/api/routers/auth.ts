import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { hashPassword } from "~/server/auth/auth-utils";
import { db } from "~/server/db";

export const authRouter = createTRPCRouter({
  signup: publicProcedure
    .input(
      z.object({
        username: z.string().min(1),
        password: z.string().min(6),
        name: z.string().optional(),
        email: z.string().email().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const existingUser = await db.user.findUnique({
        where: { username: input.username },
      });

      if (existingUser) {
        throw new Error("Username already exists");
      }

      const passwordHash = await hashPassword(input.password);

      const user = await db.user.create({
        data: {
          username: input.username,
          passwordHash,
          name: input.name,
          email: input.email,
        },
      });

      return { id: user.id, username: user.username };
    }),
});
