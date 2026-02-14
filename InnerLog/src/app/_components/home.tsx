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

export function BrowserSignIn() {
    const logIn = async () => {
        await Browser.open({ url: "https://inner-log-nine.vercel.app/api/auth/signin" });
        // Reload the WebView if running on a real device
  if (Capacitor.getPlatform() === "ios" || Capacitor.getPlatform() === "android") {
    window.location.reload();
  }
    }

    return (
        <button onClick={logIn} className="rounded-full bg-white/40 px-10 py-3 font-semibold no-underline transition hover:bg-white/50">
            Sign in with Browser API
        </button>
    )

}

export function EmailSignIn() {
    const [email, setEmail] = useState("");
    
    const [message, setMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await signIn("email", {
      email,
      redirect: false, // we handle redirect ourselves
      callbackUrl: "/", // where to go after login
    });

    if (result?.error) {
      setMessage("Error sending email. Try again.");
    } else {
      setMessage("Magic link sent! Check your inbox.");
    }
  };

  return (
    <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "0.5rem", width: "300px" }}>
      <input
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={{ padding: "0.5rem", fontSize: "1rem" }}
      />
      <button type="submit" style={{ padding: "0.5rem", fontSize: "1rem" }}>Send Magic Link</button>
      {message && <p>{message}</p>}
    </form>
  );
}