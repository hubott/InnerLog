"use client";

import { redirect } from "next/navigation";

export function HomeButton() {
    const redirectToHome = () => {
        redirect("/home");
    }

    return (
        <button onClick={redirectToHome} className="text-5xl text-orange-700 cursor-pointer hover:text-orange-900 transition hover:bg-orange-250">
            Daily Notes
        </button>
    )
}