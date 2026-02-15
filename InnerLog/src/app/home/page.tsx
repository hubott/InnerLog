import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { Note } from "../_components/note";
import { Navbar } from "../_components/dropdown";
import { HomeButton } from "../_components/home";

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
      <h1 className="text-xl font-bold text-center">Today&apos;s date is: {new Date().toLocaleDateString("en-GB")}</h1>
      <h1 className="text-xl font-bold">What have you done today that you are proud of?</h1>
      <Note />
      <h1 className="text-xl font-bold">Hi there {userName}</h1>
      </div>
      </div>

  );
}
