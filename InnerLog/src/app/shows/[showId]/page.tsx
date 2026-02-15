import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { Seasons } from "../../_components/seasons";
import { Navbar } from "../../_components/dropdown";
import { HomeButton } from "../../_components/home";

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
      <title>Inner Log</title>
      <div className="flex justify-between items-center w-full">
        <Navbar />
      </div>
      <div className="w-80% flex flex-col gap-6">
      <HomeButton />
      <Seasons showId={showId} />
      </div>
    </div>

  );
}
