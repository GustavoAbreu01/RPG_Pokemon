"use client";
import PokemonSprite from "./PokemonSprite";
import { cn } from "../../../lib/utils";

export default function SwitchMenu({ team, currentId, onSwitch }) {
  console.log("SwitchMenu team:", team);
  return (
    <div className="grid grid-cols-1 gap-4 mb-4 mx-auto">
      {team.map((u) => {
        const isCurrent = u.id === currentId;
        const isFainted = u.current_hp <= 0;
        return (
          <button
            key={u.id}
            disabled={isCurrent || isFainted}
            onClick={() => onSwitch(u.id)}
            className={cn(
              "p-1 border border-3 rounded-lg flex flex-col items-center transition hover:shadow-md cursor-pointer bg-white",
              isCurrent && "border-black",
              isFainted && "opacity-50 cursor-not-allowed",
              !isCurrent && !isFainted && "hover:shadow-lg hover:border-gray-500"
            )}
          >
            <PokemonSprite name={u.pokemon_id.toString()} variant="pixel" />
            <p>Vida atual: {u.current_hp}</p>
            <p className="text-xs truncate">Lvl {u.level}</p>
            {isFainted && (
              <span className="text-red-500 text-xs mt-1">Desmaiado</span>
            )}
          </button>
        );
      })}
    </div>
  );
}