"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { LoginForm } from "@/components/login-form";
import logo from "../app/assets/images/Gama.png";
import { GradientBackground } from "@/components/animate-ui/backgrounds/gradient";
import Image from "next/image";

export default function Page() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Se tiver cookie, manda pro menu
    if (Cookies.get("currentUser")) {
      router.replace("/menu");
    } else {
      setChecking(false);
    }
  }, [router]);

  if (checking) {
    return <p className="flex items-center justify-center h-screen">Verificando…</p>;
  }

  return (
    <>
      <GradientBackground />
      <Image src={logo} alt="Gama Academy" className="absolute top-6 left-6 z-10 w-10 h-auto" />
      <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 bg-gray-900 z-10">
        <div className="w-full max-w-sm z-10">
          <LoginForm />
        </div>
      </div>
    </>
  );
}
