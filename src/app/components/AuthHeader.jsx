"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import logo from "../assets/images/Gama.png"; // Ajuste o caminho conforme necessário
import Image from "next/image";

export default function AuthHeader() {
  const pathname = usePathname();
  const [logged, setLogged] = useState(false);

  useEffect(() => {
    // toda vez que a rota mudar, verifica se o cookie existe
    const token = Cookies.get("currentUser");
    setLogged(!!token);
  }, [pathname]);

  return (
    <header className="fixed top-0 left-0 w-full bg-black/30 backdrop-blur-md border-b border-gray-800 z-50">
      <div className="mx-auto flex items-center justify-between h-16 px-4 md:px-8">
        {/* Logo e título */}
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src={logo}
            alt="Gama Academy"
            className="w-10 h-auto"
            width={40}
            height={40}
          />
          <span className="text-white text-xl font-bold">Pokémon Game</span>
        </Link>

        {/* Links condicionais */}
        <nav className="flex items-center space-x-6">
          {logged ? (
            <>
              <Link href="/pages/game" className="text-white hover:text-gray-200">
                Jogar
              </Link>
              <Link href="/pages/profile" className="text-white hover:text-gray-200">
                Perfil
              </Link>
              <Link href="/pages/scheme" className="text-white hover:text-gray-200">
                Banco de Dados
              </Link>
            </>
          ) : (
            <>
              <Link href="/" className="text-white hover:text-gray-200">
                Login
              </Link>
              <Link
                href="/pages/register"
                className="text-white hover:text-gray-200"
              >
                Cadastrar
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
