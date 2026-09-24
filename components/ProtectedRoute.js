"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Loader from "@/components/Loader";

// Wraps any page that requires a logged-in user. Redirects to /login
// if there's no session once the initial auth check has finished.
export default function ProtectedRoute({ children }) {
  const { user, checking } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!checking && !user) {
      router.replace("/login");
    }
  }, [checking, user, router]);

  if (checking) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader label="Checking your session..." />
      </div>
    );
  }

  if (!user) return null;

  return children;
}
