"use client";

import { redirect } from "next/navigation";
import { Browser } from "@capacitor/browser";
import { Capacitor } from "@capacitor/core";
import { useState } from "react";
import { signIn } from "next-auth/react";

export function HomeButton() {
    const redirectToHome = () => {
        redirect("/home");
    }

    return (
        <div className="w-full flex justify-center">
        <button
  onClick={redirectToHome}
  className="group text-5xl text-white cursor-pointer transition hover:bg-orange-200 px-2 py-1 rounded"
>
  <span className="transition group-hover:text-slate-100">
    Inner
  </span>{" "}
  <span className="text-amber-500 transition group-hover:text-amber-600">
    Log
  </span>
</button>
</div>

    )
}
