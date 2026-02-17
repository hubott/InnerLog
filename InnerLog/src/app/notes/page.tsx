import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { GetNotes } from "../_components/note";
import { Navbar } from "../_components/dropdown";
import { HomeButton } from "../_components/home";
import TodayDate from "../_components/date";

export default async function NotePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }



  return (
    <div className="flex flex-col gap-6 p-2 bg-orange-200">
      <title>Inner Log</title>
      <div className={`flex justify-between items-center w-full`}>
        <Navbar />
      </div>
      <div className="items-center flex flex-col gap-6">
      <HomeButton />
      <TodayDate />
      <GetNotes />
      </div>
    </div>

  );
}
