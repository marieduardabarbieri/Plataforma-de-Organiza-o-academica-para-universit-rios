"use client";

import { redirect } from "next/navigation";
import { authClient } from "@/_lib/auth-client";

export default function AuthPage() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) return null;

  if (session) {
    redirect("/");
  }

  const handleGoogleLogin = async () => {
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: process.env.NEXT_PUBLIC_BASE_URL,
    });

    if (error) {
      console.error(error.message);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center">
      <button
        onClick={handleGoogleLogin}
        className="rounded bg-blue-600 px-6 py-3 text-white"
      >
        Entrar com Google
      </button>
    </main>
  );
}
