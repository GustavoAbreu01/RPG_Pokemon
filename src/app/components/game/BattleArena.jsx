"use client";
import { useState, useEffect } from "react";
import PokemonSprite from "./PokemonSprite";
import HealthBar from "./HealthBar";
import AttackMenu from "./AttackMenu";
import battleBG1 from "../../assets/images/BurningField.png";
import battleBG2 from "../../assets/images/DarkField.png";
import battleBG3 from "../../assets/images/ElectricField.png";
import battleBG4 from "../../assets/images/GrassyField.png";
import battleBG5 from "../../assets/images/Icyfield.png";

const BACKGROUNDS = [
  battleBG1,
  battleBG2,
  battleBG3,
  battleBG4,
  battleBG5,
];

export default function BattleArena({ player, enemy, onAttack }) {
  const [bg, setBg] = useState(null);

  // random background on first render
  useEffect(() => {
    const idx = Math.floor(Math.random() * BACKGROUNDS.length);
    setBg(BACKGROUNDS[idx]);
  }, []);

  if (!player || !enemy || !bg) return null;

  return (
    <div
      className="relative mx-auto w-full max-w-6xl h-[600px] rounded-lg overflow-hidden shadow-lg border-10 border-gray-900"
      style={{
        backgroundImage: `url(${bg.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Enemy Pokémon in top-right */}
      <div className="absolute top-60 right-50 flex flex-col items-center">
        <PokemonSprite name={enemy.name} variant="front" className="w-60 h-60" />
        <div className="mt-2 w-40">
          <HealthBar current={enemy.currentHp} max={enemy.maxHp} color="red" />
        </div>
        <p className="mt-1 text-sm font-semibold bg-white/80 px-2 rounded">Lv {enemy.level}</p>
      </div>

      {/* Player Pokémon in bottom-left */}
      <div className="absolute bottom-2 left-35 flex flex-col items-center">
        <PokemonSprite name={player.name} variant="back" className="w-60 h-60" />
        <div className="mt-2 w-40">
          <HealthBar current={player.currentHp} max={player.maxHp} color="green" />
        </div>
        <p className="mt-1 text-sm font-semibold bg-white/80 px-2 rounded">Lv {player.level}</p>
      </div>
    </div>
  );
}
