"use client";

import { useState, useEffect } from "react";
import {
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  User,
} from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import {
  LayoutDashboard,
  PenSquare,
  LogOut,
  Lock,
  Loader2,
} from "lucide-react";

const googleProvider = new GoogleAuthProvider();

const ADMIN_EMAILS: string[] = [
  "hesham.zaghloul@zatsys.com",
  "mr.hesham.zaghloul@gmail.com",
  "t25g1980@gmail.com",
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setChecking(false);
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    setSigningIn(true);
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      setError(err.message || "فشل تسجيل الدخول");
    } finally {
      setSigningIn(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <Loader2 className="animate-spin text-accent-gold" size={32} />
      </div>
    );
  }

  if (user && !ADMIN_EMAILS.includes(user.email || "")) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark p-4"
        dir="rtl"
      >
        <div className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-800 text-center">
          <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
            <Lock className="text-red-500" size={24} />
          </div>
          <h1 className="text-xl font-bold text-charcoal dark:text-gray-100 mb-2">
            غير مصرّح
          </h1>
          <p className="text-sm text-charcoal-light dark:text-gray-400 mb-4">
            الحساب {user.email} ليس لديه صلاحية الوصول
          </p>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg bg-red-500 text-white font-bold hover:opacity-90 transition"
          >
            تسجيل الخروج
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark p-4"
        dir="rtl"
      >
        <div className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-800">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-full bg-accent-gold/10 flex items-center justify-center mx-auto mb-4">
              <Lock className="text-accent-gold" size={24} />
            </div>
            <h1 className="text-xl font-bold text-charcoal dark:text-gray-100">
              لوحة تحكم عودة
            </h1>
            <p className="text-sm text-charcoal-light dark:text-gray-400 mt-1">
              سجّل الدخول بحساب Google المُصرّح
            </p>
          </div>
          <div className="space-y-4">
            <button
              onClick={handleGoogleSignIn}
              disabled={signingIn}
              className="w-full py-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-charcoal dark:text-gray-100 font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {signingIn ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              )}
              {signingIn ? "جارٍ تسجيل الدخول..." : "تسجيل الدخول بـ Google"}
            </button>
            {error && (
              <p className="text-red-500 text-xs text-center">{error}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Admin Top Bar */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50">
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14"
          dir="rtl"
        >
          <div className="flex items-center gap-6">
            <a href="/admin" className="text-lg font-bold text-accent-gold">
              لوحة تحكم عودة
            </a>
            <nav className="flex items-center gap-1">
              <a
                href="/admin"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-charcoal dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <LayoutDashboard size={15} />
                المقالات
              </a>
              <a
                href="/admin/write"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-charcoal dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <PenSquare size={15} />
                كتابة جديد
              </a>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-charcoal-light dark:text-gray-400 hidden sm:block">
              {user.email}
            </span>
            {user.photoURL && (
              <img
                src={user.photoURL}
                alt=""
                className="w-7 h-7 rounded-full"
                referrerPolicy="no-referrer"
              />
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
            >
              <LogOut size={15} />
              خروج
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">{children}</main>
    </div>
  );
}
