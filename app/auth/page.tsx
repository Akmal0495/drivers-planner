"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setError(null);
    setSuccess(false);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      router.push("/"); // ✅ перенаправление на главную страницу
    }
  };

  return (
    <div className="p-4 max-w-sm mx-auto">
      <h1 className="text-lg font-bold mb-4">🚖 Driver Login</h1>
      <input
        className="border p-2 w-full mb-2"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        className="border p-2 w-full mb-2"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={handleLogin}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-full"
      >
        Login
      </button>
      {error && <p className="text-red-500 mt-2">Error: {error}</p>}
      {success && <p className="text-green-500 mt-2">Success ✅</p>}
    </div>
  );
}
