import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { TaskCreator } from "../_components/tasks";
import { Navbar } from "../_components/dropdown";
import { HomeButton } from "../_components/home";
import TodayDate from "../_components/date";

export default async function TasksPage() {
  const session = await auth();


  if (!session?.user) {
    redirect("/");
  }



  return (
    <div className="flex min-h-screen flex-col gap-6 p-2 bg-orange-200">
      <title>Inner Log</title>

      <Navbar />

      <div className="items-center flex flex-col gap-6">
      <HomeButton />
      <TodayDate />
      <TaskCreator />
      </div>
    </div>

  );
}
