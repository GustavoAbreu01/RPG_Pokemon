// components/game/PokemonSprite.jsx
"use client";

import { useState, useEffect } from "react";

export default function PokemonSprite({ name, variant = "front" }) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (!name) return;
    fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`)
      .then((r) => r.json())
      .then((j) => {
        const front = j.sprites.versions["generation-v"]["black-white"].animated.front_default;
        const back = j.sprites.versions["generation-v"]["black-white"].animated.back_default;
        const pixel = j.sprites.front_default;
        // se back não existir, usa front e gira
        setUrl(variant == "back" && back ? back : variant === "pixel" ? pixel : front);
      })
      .catch(console.error);
  }, [name, variant]);

  if (!url) {
    return <div className="w-32 h-32 bg-gray-200 animate-pulse rounded-lg" />;
  }

  return (
    <img
      src={url}
      alt={`${name} sprite`}
      className="w-30 h-30 object-contain"
      style={{
        transform:
          variant === "back" && !url.includes("back_default")
            ? ""
            : undefined,
      }}
    />
  );
}
