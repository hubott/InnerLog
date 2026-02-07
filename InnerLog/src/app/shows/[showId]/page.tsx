import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { Seasons } from "../../_components/episodes";
import { Dropdown } from "../../_components/dropdown";
import { HomeButton } from "../../_components/home";
import Link from "next/link";

export default async function ShowPage({
    params,
}: {
    params: Promise<{ showId: string }>; 
}) {
    const { showId } = await params;
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }



  return (
    <div className="flex min-h-screen flex-col gap-6 p-2 bg-orange-200">
      <title>Daily Notes </title>
      <div className="flex justify-between items-center w-full">
        <Dropdown />
        <button className="rounded-full bg-white/40 px-4 py-2 font-semibold transition hover:bg-white/20">
        <Link href="/api/auth/signout">Sign out</Link>
        </button>
      </div>
      <div className="w-80% flex flex-col gap-6">
      <HomeButton />
      <Seasons showId={showId} />
      </div>
    </div>

  );
}
