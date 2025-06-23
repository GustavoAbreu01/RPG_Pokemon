"use client";

import Image from "next/image";
import Link from "next/link";
import logo from "../assets/images/Gama.png";
import { TbPokeball } from "react-icons/tb";
import { FaRegCircleUser } from "react-icons/fa6";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full bg-black/30 backdrop-blur-md border-b border-gray-800 z-120">
      <div className="mx-auto flex items-center justify-between h-16 px-4 md:px-8">
        
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src={logo}
            alt="Logo Pokémon"
            width={32}
            height={32}
            className="object-contain"
          />
          <span className="text-white text-xl font-bold">Pokémon Game</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            href="/pages/game"
            className="flex items-center space-x-2 text-white hover:text-gray-200 transition-colors"
          >
            <TbPokeball size={28} />
          </Link>
          <Link
            href="/pages/profile"
            className="flex items-center space-x-2 text-white hover:text-gray-200 transition-colors"
          >
            <FaRegCircleUser size={24} />
          </Link>
        </nav>
      </div>
    </header>
  );
}
