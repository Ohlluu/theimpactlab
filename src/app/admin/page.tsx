"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

/**
 * Mock sign-in.
 *
 * There is no authentication here and there is not meant to be — this is the
 * design mockup, and the point is for Andrea to feel what having a private
 * dashboard is like. Any credentials get you in.
 *
 * The real build replaces this with a proper session: hashed password, HTTP-only
 * cookie, and server-side route protection. See REPLACE-BEFORE-LAUNCH.md.
 */
export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const signIn = (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      sessionStorage.setItem("impactlab.admin", "1");
    } catch {
      /* private browsing — the dashboard falls back to open access */
    }
    // A beat of latency so it reads as a real sign-in rather than a page swap.
    setTimeout(() => router.push("/admin/dashboard"), 450);
  };

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-14 block">
          <Image
            src="/img/logo-wordmark-white.png"
            alt="The Impact Lab"
            width={476}
            height={158}
            priority
            className="h-9 w-auto"
          />
        </Link>

        <div className="relative">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-3 -top-3 h-10 w-10 border-r-2 border-t-2 border-brass-400"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-3 -left-3 h-10 w-10 border-b-2 border-l-2 border-brass-400"
          />

          <div className="bg-olive-900/70 p-9 md:p-11">
            <p className="label text-brass-400">Private</p>
            <h1 className="mt-5 text-4xl text-paper">Dashboard</h1>
            <p className="mt-4 text-sm leading-relaxed text-paper/55">
              Manage your availability, review upcoming appointments, and see
              who has booked.
            </p>

            <form onSubmit={signIn} className="mt-9 space-y-5">
              <div>
                <label htmlFor="email" className="label mb-2.5 block text-paper/65">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="andrea@theimpactlab.co"
                  autoComplete="username"
                  className="w-full border border-paper/20 bg-transparent px-4 py-3.5 text-[0.95rem] text-paper placeholder:text-paper/25 transition-colors focus:border-brass-400 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="password" className="label mb-2.5 block text-paper/65">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  autoComplete="current-password"
                  className="w-full border border-paper/20 bg-transparent px-4 py-3.5 text-[0.95rem] text-paper placeholder:text-paper/25 transition-colors focus:border-brass-400 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={busy}
                className="w-full bg-brass-400 px-7 py-4 label text-olive-950 transition-colors duration-300 hover:bg-brass-300 disabled:opacity-60"
              >
                {busy ? "Signing in…" : "Sign In"}
              </button>
            </form>
          </div>
        </div>

        <p className="mt-8 border-l-2 border-brass-400/50 pl-4 text-xs leading-relaxed text-paper/45">
          <span className="text-brass-400/90">Mockup note —</span> this sign-in
          is a placeholder so you can see the dashboard. Any email and password
          will work. Real authentication is part of the final build.
        </p>

        <Link
          href="/"
          className="mt-8 inline-block text-sm text-paper/40 transition-colors hover:text-paper/70"
        >
          ← Back to the website
        </Link>
      </div>
    </main>
  );
}
