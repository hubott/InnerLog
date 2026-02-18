"use client";

import { signIn } from "next-auth/react";
import { redirect } from "next/dist/server/api-utils";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-[350px] space-y-4 flex flex-col items-center rounded bg-orange-200 p-6">
        <h1 className="text-2xl font-bold justify-center mb-20">Welcome back</h1>

        {/* Google */}
        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="w-full rounded bg-amber-500 p-3 text-white cursor-pointer hover:bg-amber-700"
        >
          Continue with Google
        </button>

        <div className="text-center text-sm">or</div>

        {/* Credentials */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const email = (form.email as HTMLInputElement).value;
            const password = (form.password as HTMLInputElement).value;

            signIn("credentials", {
              email,
              password,
              callbackUrl: "/dashboard",
            });
          }}
          className="space-y-3"
        >
          <input name="email" placeholder="Email" className="w-full border p-2 bg-orange-100" />
          <input
            name="password"
            type="password"
            placeholder="Password"
            className="w-full border p-2 bg-orange-100"
          />

          <button className="w-full rounded bg-blue-600 p-3 text-white cursor-pointer hover:bg-blue-700">
            Continue
          </button>
        </form>
              <div>
      <h1 className="mt-10 text-sm flex justify-center">New User? Click here to sign up!</h1>
        <Link
          href="/signup"
          className="w-full p-3 text-blue-600 cursor-pointer flex justify-center hover:underline"
        >
          Sign Up
        </Link>
        </div>
      </div>

    </div>
  );
}
