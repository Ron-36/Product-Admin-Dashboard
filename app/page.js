"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Loader from "@/components/Loader";

export default function Home() {
  const { user, checking } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!checking) {
      router.replace(user ? "/products" : "/login");
    }
  }, [checking, user, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader label="Loading..." />
    </div>
  );
}
