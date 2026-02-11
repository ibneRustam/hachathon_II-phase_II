"use client";

import { useState } from "react";
import Link from "next/link";

const API_URL = "http://127.0.0.1:8000";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");

  const handleLogin = async () => {
    if (!email || !password) return alert("Please fill in all fields");

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // ڈیٹا سیو کریں
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("userId", data.user_id);
        setToken(data.access_token);
        
        alert("Login Successful! Redirecting...");
        
        // یہ لائن آپ کو زبردستی ٹاسک پیج پر لے جائے گی
        window.location.href = "/tasks"; 
      } else {
        alert("Login failed: " + (data.detail || "Invalid credentials"));
      }
    } catch (err) {
      alert("Network Error: Make sure backend is running");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] flex flex-col items-center justify-center p-6 text-zinc-100 font-sans">
      <div className="max-w-md w-full bg-[#09090b] border border-zinc-800 rounded-3xl p-10 shadow-2xl">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight italic">Login</h1>
          <p className="text-zinc-500 text-sm mt-2">Enter credentials to access your dashboard.</p>
        </header>

        <div className="space-y-5">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none transition-all text-white"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none transition-all text-white"
          />
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-white text-black font-extrabold py-3 rounded-xl hover:bg-zinc-200 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? "Checking..." : "Login "}
          </button>
        </div>

        {token && (
           <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
             <p className="text-[10px] text-blue-400 font-mono break-all">{token}</p>
             <button 
               onClick={() => window.location.href = "/tasks"}
               className="w-full mt-2 bg-blue-600 text-white text-xs py-2 rounded-lg font-bold"
             >
               Click here if not redirected
             </button>
           </div>
        )}

        <p className="text-center text-zinc-500 text-xs mt-8">
          Need an account? <Link href="/signup" className="text-white hover:underline font-bold">Register</Link>
        </p>
      </div>
    </div>
  );
}