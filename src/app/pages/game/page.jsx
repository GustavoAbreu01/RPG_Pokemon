// pages/game/index.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useBattle } from "../../hooks/useBattle";
import SwitchMenu from "../../components/game/SwitchMenu";
import BattleArena from "../../components/game/BattleArena";
import AttackMenu from "../../components/game/AttackMenu";
import { Button } from "../../../components/ui/button";
import bedroom from "../../assets/images/bedroom.png";

export default function GamePage() {
  const router = useRouter();
  const [phase, setPhase] = useState(1);
  const {
    team,
    player,
    enemy,
    doAttack,
    switchPokemon,
    mustSwitch,
    lost,
    victory,
  } = useBattle(phase);

  // on victory advance phase after delay
  useEffect(() => {
    if (victory) {
      const t = setTimeout(() => setPhase((p) => Math.min(p + 1, 100)), 2000);
      return () => clearTimeout(t);
    }
  }, [victory]);

  // if total defeat
  if (lost) {
    return (
      <div className="p-8 pt-30 space-y-6 bg-cover bg-center w-full h-screen overflow-hidden font-[geist] item-center justify-center flex flex-col text-center text-white"
        style={{ backgroundImage: `url(${bedroom.src})` }}>
        <p className="text-xl">
          Todos os seus Pokémons foram derrotados!
        </p>
        <p>Retornando ao menu…</p>
      </div>
    );
  }

  // still loading
  if (!player || !enemy) {
    return <p className="p-8">Carregando fase {phase}…</p>;
  }

  return (
    <div className="p-8 pt-30 space-y-6 bg-cover bg-center w-full h-screen overflow-hidden font-[geist]"
      style={{ backgroundImage: `url(${bedroom.src})` }}>

      {mustSwitch ? (
        <div className="text-center space-y-4 bg-white/60 p-6 rounded-lg shadow-lg">
          <p className="text-xl text-red-600">Seu Pokémon desmaiou!</p>
          <p>Escolha outro para continuar:</p>
          <SwitchMenu
            team={team}
            currentId={player.id}
            onSwitch={switchPokemon}
            className="flex space-y-4"
          />
        </div>
      ) : (
        <div className="flex h-[650px] gap-6">
          {/* left: vertical team switch */}
          <div className="w-1/8 overflow-y-auto ">
            <SwitchMenu
              team={team}
              currentId={player.id}
              onSwitch={switchPokemon}
              className="flex flex-col space-y-4"
            />
          </div>

          {/* right: huge battle + attacks */}
          <div className="w-5/5 flex flex-col">
            <div className="flex-1">
              <BattleArena player={player} enemy={enemy} onAttack={doAttack} />
            </div>
            <div className="mt-4 w-full flex justify-center items-center">
              <AttackMenu moves={player.moves} onSelect={doAttack} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

