"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { adminLogin } from "@/services/auth.service";
import Image from "next/image";

export default function AdminLoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await adminLogin({
        email,
        password,
      });

      localStorage.setItem("adminToken", response.data.accessToken);

      router.push("/admin/dashboard");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl border border-border bg-white p-6 shadow-xl sm:p-8">
        <div className="mb-8 text-center">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg sm:h-11 sm:w-11 sm:rounded-xl">
            <Image
              src="/web-app-manifest-192x192.png"
              alt="Budget Wear logo"
              width={44}
              height={44}
              priority
              className="h-full w-full object-contain"
            />
          </div>

          <h1 className="mt-4 text-2xl font-extrabold text-foreground">
            Admin Login
          </h1>

          <p className="mt-2 text-sm text-muted">
            Sign in to manage your store
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-foreground"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@example.com"
              className="h-12 w-full rounded-xl border border-border bg-white px-4 text-sm outline-none transition focus:border-primary"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-semibold text-foreground"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              className="h-12 w-full rounded-xl border border-border bg-white px-4 text-sm outline-none transition focus:border-primary"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="min-h-12 w-full rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
