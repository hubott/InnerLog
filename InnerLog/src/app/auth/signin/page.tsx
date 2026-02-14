// Example custom sign-in page. See original response for full code.
"use client"; // If using App Router client component
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      redirect: false, // Prevent default redirect
      email, password,
      // callbackUrl: "/" // Optional
    });

    if (result?.error) {
      console.error(result.error); // Handle error
    } else {
      // Handle success (e.g., manual redirect)
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Email: <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
      <label>Password: <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
      <button type="submit">Sign In</button>
    </form>
  );
}
