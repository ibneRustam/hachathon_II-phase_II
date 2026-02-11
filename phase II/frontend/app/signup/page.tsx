"use client";

import { useState } from "react";
import Link from "next/link";

const API_URL = "http://127.0.0.1:8000"; 

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!email || !password) return alert("Please fill all fields");
    
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // سائن اپ ہوتے ہی ڈیٹا محفوظ کریں تاکہ دوبارہ لاگ ان نہ کرنا پڑے
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("userId", data.user_id);
        
        alert("Account Created Successfully! Taking you to your tasks...");
        
        // سیدھا ٹاسک پیج پر بھیج دیں
        window.location.href = "/tasks";
      } else {
        alert("Signup failed: " + (data.detail || "User already exists"));
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
        <header className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white italic">Create Account</h1>
          <p className="text-zinc-500 text-sm mt-3">Start managing your tasks in seconds.</p>
        </header>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Email</label>
            <input
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-white outline-none transition-all text-white"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-white outline-none transition-all text-white"
            />
          </div>

          <button
            onClick={handleSignup}
            disabled={loading}
            className="w-full bg-white text-black font-extrabold py-4 rounded-xl hover:bg-zinc-200 transition-all active:scale-[0.98] disabled:opacity-50 uppercase text-xs tracking-widest"
          >
            {loading ? "Creating Account..." : "Sign Up Now"}
          </button>
        </div>

        <footer className="mt-8 pt-6 border-t border-zinc-800/50 text-center">
          <p className="text-zinc-500 text-xs">
            Already a member?{" "}
            <Link href="/login" className="text-white hover:underline font-bold transition-colors">
              Sign In
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
}