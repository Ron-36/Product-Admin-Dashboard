"use client";

import Link from "next/link";
import { Boxes, LogOut, Plus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-20 border-b border-ink-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/products" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white">
            <Boxes className="h-5 w-5" />
          </span>
          <span className="text-lg font-semibold text-ink-900">
            Product Admin
          </span>
        </Link>

        {user && (
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/products/add"
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-2 text-sm font-medium text-white shadow-card transition hover:bg-brand-700 sm:px-4"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add product</span>
            </Link>

            <div className="hidden items-center gap-2 rounded-lg bg-ink-50 px-3 py-1.5 sm:flex">
              <img
                src={user.image}
                alt=""
                className="h-6 w-6 rounded-full object-cover"
              />
              <span className="text-sm font-medium text-ink-700">
                {user.firstName}
              </span>
            </div>

            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 rounded-lg border border-ink-200 px-3 py-2 text-sm font-medium text-ink-600 transition hover:bg-ink-50"
              title="Log out"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
