import { postRouter } from "~/server/api/routers/post";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { NoteRouter } from "./routers/note";
import { TaskRouter } from "./routers/task";
import { ShowRouter } from "./routers/show";
import { SeasonRouter } from "./routers/season";
import { EpisodeRouter } from "./routers/episode";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  note: NoteRouter,
  task: TaskRouter,
  show: ShowRouter,
  season: SeasonRouter,
  episode: EpisodeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
