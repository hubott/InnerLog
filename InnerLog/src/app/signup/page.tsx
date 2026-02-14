"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { signIn } from "next-auth/react";

export default function SignUpPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const signupMutation = api.auth.signup.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 1️⃣ Create the user
      await signupMutation.mutateAsync({ username, password, name, email });

      // 2️⃣ Immediately log them in
      const res = await signIn("credentials", {
        redirect: true,
        username,
        password,
        callbackUrl: "/", // home page
      });

      // Optional: if you want to handle errors manually
      // if (!res?.ok) setMessage("Login failed after signup");

    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 max-w-md mx-auto mt-10">
      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        placeholder="Name (optional)"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email (optional)"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Sign Up
      </button>
      {message && <p>{message}</p>}
    </form>
  );
}
