import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { Note } from "../_components/note";
import { Dropdown } from "../_components/dropdown";
import Link from "next/link";

export default async function NotePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }
  const userName = session.user.name;



  return (
    <div className="flex min-h-screen flex-col gap-6 p-2 bg-linear-to-br from-purple-400 via-pink-500 to-blue-500">
      <title>Daily Notes </title>
      <div className="flex justify-between items-center w-full"> 
        <Dropdown />
        <button className="rounded-full bg-white/40 px-4 py-2 font-semibold transition hover:bg-white/20">
        <Link href="/api/auth/signout">Sign out</Link>
        </button>
      </div>
      <div className="items-center flex flex-col gap-6">
      <h1 className="text-5xl">Daily Notes</h1>
      <h1 className="text-xl font-bold text-center">Today&apos;s date is: {new Date().toLocaleDateString("en-GB")}</h1>
      <h1 className="text-xl font-bold">What have you done today that you are proud of?</h1>
      <Note />
      <h1 className="text-xl font-bold">Hi there {userName}</h1>
      </div>
    </div>

  );
}
