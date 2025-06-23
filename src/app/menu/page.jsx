"use client";

import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { GradientBackground } from "@/components/animate-ui/backgrounds/gradient";
import { Card } from "@/components/ui/card";
import flask from "../assets/images/flask_transparent.png";
import Image from "next/image";

export default function MenuPage() {
  const router = useRouter();

  return (
    <><GradientBackground />
      <div className="flex flex-col items-center justify-between min-h-screen font-[geist]">
        <div className="bg-gray-900 w-screen h-screen flex items-center justify-around flex-col text-white">

          <div className="flex flex-col py-10 w-full gap-3 max-w-xs z-90 ">
            <Button className="w-full" onClick={() => router.push("/pages/game")}>
              Iniciar Jogo
            </Button>
            <Button className="w-full" onClick={() => router.push("/pages/profile")}>
              Perfil
            </Button>
            <Button className="w-full" onClick={() => router.push("/pages/scheme")}>
              Estrutura do Banco de Dados
            </Button>
          </div>
        </div>
        <div className="w-full py-10 sm:py-10 fixed bottom-0 bg-black/10 font-[geist]">
          <div className="mx-auto px-6 lg:px-8">
            <h2 className="text-center text-lg/8 font-semibold text-white ">Principais ferramentas utilizadas para o desenvolvimento para aplicação</h2>
            <div className="mx-auto  grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-6">
              <img className="col-span-2 max-h-12 w-full object-contain lg:col-span-1" src="https://img.icons8.com/fluent-systems-filled/200/FFFFFF/nextjs.png" alt="Transistor" width="158" height="48" />
              <img className="col-span-2 max-h-12 w-full object-contain lg:col-span-1" src="https://img.icons8.com/win8/512/FFFFFF/python.png" alt="Reform" width="158" height="48" />
              <Image className="col-span-2 max-h-40 object-contain lg:col-span-1" src={flask} alt="Tuple" width="508" height="508" />
              <img className="col-span-2 max-h-12 w-full object-contain sm:col-start-2 lg:col-span-1" src="https://companieslogo.com/img/orig/MDB.D-9b200438.png?t=1720244492" alt="SavvyCal" width="158" height="48" />
              <img className="col-span-2 col-start-2 max-h-12 w-full object-contain sm:col-start-auto lg:col-span-1" src="https://img.icons8.com/m_outlined/200/FFFFFF/tailwind_css.png" alt="Statamic" width="158" height="48" />
              <img className="col-span-2 col-start-2 max-h-12 w-full object-contain sm:col-start-auto lg:col-span-1" src="https://nodejs.org/static/logos/nodejsStackedWhite.svg" alt="Statamic" width="158" height="48" />
            </div>
          </div>
        </div>
      </div></>
  );
}

