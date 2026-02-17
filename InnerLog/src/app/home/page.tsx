import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { Note } from "../_components/note";
import { Navbar } from "../_components/dropdown";
import { HomeButton } from "../_components/home";
import TodayDate from "../_components/date";

export default async function NotePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }
  const userName = session.user.name;



  return (
    <div className="flex flex-col gap-6 p-2 bg-orange-200">
      <title>Inner Log</title>
      <div className={`flex justify-between items-center w-full`}> 
        <Navbar />
      </div>
      <div className="items-center flex flex-col gap-6">
      <HomeButton />
      <TodayDate />
      <h1 className="text-xl font-bold">What have you done today that you are proud of?</h1>
      <Note />
      <h1 className="text-xl font-bold">Hi there {userName}</h1>
      </div>
      </div>

  );
}
