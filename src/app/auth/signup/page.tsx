"use client";

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="max-w-sm mx-auto mt-20">
      <div className="bg-card border border-border rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>

        {error && (
          <div className="bg-red-900/30 text-red-400 text-sm p-3 rounded-md mb-4 border border-red-800">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-1">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-black py-2 rounded-md hover:bg-primary-hover disabled:opacity-50 text-sm font-medium"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p className="text-sm text-muted text-center mt-4">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-primary hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
