import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { Shows } from "../_components/show";
import { Navbar } from "../_components/dropdown";
import { HomeButton } from "../_components/home";


export default async function ShowsPage() {
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
      <div className="items-center flex flex-col gap-6">
      <HomeButton />
      <Shows />
      </div>
    </div>

  );
}
