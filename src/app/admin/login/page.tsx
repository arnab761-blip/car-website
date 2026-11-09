'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCars } from '@/context/CarContext';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/sections/Footer';
import { ShieldCheck, Mail, ArrowRight, CheckCircle2, AlertCircle, LogOut, Home } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { loginWithGoogle, adminList, loggedInUser, logout } = useCars();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const isAdmin = loggedInUser && (loggedInUser.role === 'admin' || loggedInUser.role === 'superadmin');

  const handleLogin = (emailToLogin: string) => {
    setError('');
    const normalized = emailToLogin.toLowerCase().trim();
    if (!normalized) {
      setError('Please enter a valid Gmail address.');
      return;
    }

    if (!adminList.includes(normalized)) {
      setError(`Access denied. "${normalized}" is not an authorized administrator. Contact Super Admin to grant access.`);
      return;
    }

    loginWithGoogle(normalized);
    router.push('/admin');
  };

  return (
    <div className="min-h-screen bg-transparent text-white flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-32">
        <div className="w-full max-w-md bg-[#0a0c13]/75 border border-white/15 rounded-3xl p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
          {/* Top Badge */}
          <div className="flex items-center justify-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-cyan-500/20 border border-amber-500/40 flex items-center justify-center shadow-lg shadow-amber-500/10">
              <ShieldCheck className="w-7 h-7 text-amber-400" />
            </div>
          </div>

          {isAdmin ? (
            /* Already logged in as Admin - allow choice to go to Admin or browse public site */
            <div className="text-center space-y-6">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                  {loggedInUser.role === 'superadmin' ? 'Super Administrator Active' : 'Administrator Active'}
                </span>
                <h1 className="text-xl font-black text-white tracking-tight mt-3">
                  Welcome back, {loggedInUser.name}
                </h1>
                <p className="text-neutral-400 text-xs mt-1 font-mono">
                  {loggedInUser.email}
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <Link
                  href="/admin"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-cyan-500 hover:from-amber-400 hover:to-cyan-400 text-black font-bold text-xs uppercase font-mono tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Enter Admin Command Center</span>
                </Link>

                <Link
                  href="/"
                  className="w-full py-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-neutral-200 hover:text-white border border-white/10 text-xs font-mono uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                >
                  <Home className="w-4 h-4 text-cyan-400" />
                  <span>Browse Public Showroom (Overview)</span>
                </Link>

                <button
                  onClick={() => logout()}
                  className="w-full py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-mono uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Switch Account / Sign Out</span>
                </button>
              </div>
            </div>
          ) : (
            /* Login Form */
            <>
              <div className="text-center mb-6">
                <h1 className="text-2xl font-black text-white tracking-tight">Admin Console Access</h1>
                <p className="text-neutral-400 text-xs mt-1">
                  Authenticate via authorized Gmail account to control fleet inventory, 3D showroom models, and user logs.
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Direct Gmail Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleLogin(email);
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                    Authorized Administrator Gmail
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="admin@apexmotors.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-cyan-500 hover:from-amber-400 hover:to-cyan-400 text-black font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
                >
                  <span>Verify & Enter Console</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Quick Demo One-Click Logins */}
              <div className="mt-6 pt-5 border-t border-white/10">
                <span className="text-[10px] font-mono uppercase text-neutral-400 block text-center mb-3">
                  One-Click Quick Admin Auth
                </span>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => handleLogin('admin@apexmotors.com')}
                    className="w-full py-2.5 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs text-neutral-300 hover:text-white flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span className="font-mono">admin@apexmotors.com</span>
                    <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                      Super Admin
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleLogin('owner@gmail.com')}
                    className="w-full py-2.5 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs text-neutral-300 hover:text-white flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span className="font-mono">owner@gmail.com</span>
                    <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                      Admin
                    </span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
