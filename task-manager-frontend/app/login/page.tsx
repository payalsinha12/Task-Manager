"use client";

import { useState } from "react";
import { api } from "../../lib/api";
import { setTokens } from "../../utils/auth";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const res = await api("/auth/login", "POST", { email, password });

      console.log("LOGIN RESPONSE:", res);

      setTokens(res.accessToken, res.refreshToken);

      router.push("/dashboard");
    } catch (err: any) {
      alert(err.message);
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-600 via-pink-500 to-red-500">

      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-80 border border-white/20">
        <h2 className="text-2xl font-bold text-white text-center mb-6">
          Welcome Back 👋
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-3 rounded bg-black/80 outline-none"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-3 rounded bg-black/80 outline-none"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-black hover:bg-gray-900 text-white py-2 rounded-xl transition"
        >
          Login
        </button>
      </div>
    </div>
  );
}