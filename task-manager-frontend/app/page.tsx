"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">

      <h1 className="text-4xl font-bold text-white mb-6">
        🚀 Task Manager App
      </h1>

      <p className="text-white mb-8 opacity-80">
        Organize your tasks beautifully
      </p>

      <div className="flex gap-4">
        <button
          onClick={() => router.push("/login")}
          className="bg-white text-black px-6 py-2 rounded-xl hover:scale-105 transition"
        >
          Login
        </button>

        <button
          onClick={() => router.push("/register")}
          className="bg-black text-white px-6 py-2 rounded-xl hover:scale-105 transition"
        >
          Register
        </button>
      </div>
    </div>
  );
}