"use client";
import Link from "next/link";

/**
 * Modern Professional UI
 * Features: Mesh Gradients, Glassmorphism, and subtle animations.
 */
export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#030303] flex flex-col items-center justify-center p-6 text-zinc-100 font-sans antialiased overflow-hidden">
      
      {/* Mesh Gradient Background - This creates the modern tech feel */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[120px] rounded-full"></div>

      <main className="max-w-4xl w-full z-10">
        <div className="relative group">
          {/* Subtle Border Glow Effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
          
          <div className="relative bg-[#09090b]/80 border border-white/5 backdrop-blur-xl rounded-2xl p-10 md:p-20 shadow-2xl">
            
            {/* Header Section */}
            <header className="mb-14 space-y-4">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">Hackathon Phase II Live</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
                Work Smarter. <br />
                Build Faster.
              </h1>
              <p className="text-zinc-400 text-lg md:text-xl font-light max-w-lg leading-relaxed">
                A minimal, high-performance task engine designed for elite developers.
              </p>
            </header>

            {/* Navigation Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href="/signup"
                className="flex items-center justify-between p-6 bg-white text-black rounded-xl hover:bg-zinc-200 transition-all duration-300 font-bold group/btn"
              >
                Start Journey
                <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
              </Link>

              <div className="grid grid-cols-2 gap-4">
                <Link
                  href="/login"
                  className="flex items-center justify-center p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all text-sm font-medium"
                >
                  Log in
                </Link>
                <Link
                  href="/tasks"
                  className="flex items-center justify-center p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all text-sm font-medium"
                >
                  Dashboard
                </Link>
              </div>
            </div>

            {/* Micro-Footer Status Bar */}
            <footer className="mt-16 flex items-center justify-between border-t border-white/5 pt-8">
              <div className="flex space-x-6 text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">
                <span className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-zinc-500 rounded-full"></div> Secure Environment
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-zinc-500 rounded-full"></div> Cloud Database
                </span>
              </div>
              <div className="text-[10px] text-zinc-600 font-mono">v2.1.0-STABLE</div>
            </footer>
          </div>
        </div>
      </main>

      {/* Background Subtle Grid Layer */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none"></div>
    </div>
  );
}