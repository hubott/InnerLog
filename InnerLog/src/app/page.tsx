import Link from "next/link";

import { auth } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";
import { redirect } from "next/navigation";
import { BrowserSignIn } from "./_components/home";
import { EmailSignIn } from "./_components/home";

export default async function Home() {
  const session = await auth();


  if (session?.user) {
    redirect("/home");
  }

  return (
    <HydrateClient>
      <main className="relative flex min-h-screen flex-col items-center justify-center bg-orange-200">
        <div className="container flex flex-col items-center justify-center gap-3 px-4 py-2">
          <title>Inner Log</title>
          
          <h1 className="text-5xl text-orange-700">Welcome to Inner Log</h1>
          <h3 className="text-2xl mb-20 text-orange-700">Your personal daily journal for tasks, notes, and shows</h3>
          <div className="flex flex-col items-center gap-2">


            <div className="flex flex-col items-center justify-center gap-4">
              <Link
                href={session ? "/api/auth/signout" : "/api/auth/signin?callbackUrl=/home"}
                className="rounded-full bg-white/40 px-10 py-3 font-semibold no-underline transition hover:bg-white/50"
              >
                {session ? "Sign out" : "Sign in"}
              </Link>
              <BrowserSignIn />
              <EmailSignIn />
            </div>
          </div>

        </div>
      </main>
    </HydrateClient>
  );
}
