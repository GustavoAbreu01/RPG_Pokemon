// pages/profile.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

// IMPORT DAS INSÍGNIAS LOCAIS
import InsigniaRocha from "../../assets/icons/Insignia_Rocha.png";
import InsigniaCascata from "../../assets/icons/Insignia_Cascata.png";
import InsigniaTrovao from "../../assets/icons/Insignia_Trov_o.png";
import InsigniaArcoRis from "../../assets/icons/Insignia_Arco-_ris.png";
import InsigniaAlma from "../../assets/icons/Insignia_Alma.png";
import InsigniaPantano from "../../assets/icons/Insignia_P_ntano.png";
import InsigniaVulcano from "../../assets/icons/Insignia_Vulc_o.png";
import InsigniaTerrestre from "../../assets/icons/Insignia_Terra.png";

import vo1 from "../../assets/icons/mystery-egg.png";
import evo3 from "../../assets/icons/intriguing-stone.png";
import lv50 from "../../assets/icons/rare-candy.png";
import lv100 from "../../assets/icons/ability-capsule.png";
import rookie from "../../assets/icons/poke.png";
import veteran from "../../assets/icons/great.png";
import legend from "../../assets/icons/ultra.png";
import superstriker from "../../assets/icons/cherish.png";
import master from "../../assets/icons/premier.png";
import champion from "../../assets/icons/master.png";

import Image from "next/image";
import { GradientBackground } from "@/components/animate-ui/backgrounds/gradient";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const POKEAPI = "https://pokeapi.co/api/v2/pokemon/";

const TYPE_COLORS = {
  Normal: "bg-gray-300",
  Fire: "bg-red-400",
  Water: "bg-blue-400",
  Grass: "bg-green-400",
  Electric: "bg-yellow-300",
  Ice: "bg-blue-200",
  Fighting: "bg-orange-500",
  Poison: "bg-purple-400",
  Ground: "bg-yellow-600",
  Flying: "bg-indigo-200",
  Psychic: "bg-pink-400",
  Bug: "bg-green-600",
  Rock: "bg-gray-500",
  Ghost: "bg-indigo-800",
  Dragon: "bg-purple-800",
  Dark: "bg-gray-700",
  Steel: "bg-gray-400",
  Fairy: "bg-pink-200",
};

// Definição das conquistas com os ícones locais
const ACHIEVEMENTS = [
  [1, "Novato", "Derrote  10 Pokémons", rookie],
  [2, "Veterano", "Derrote  50 Pokémons", veteran],
  [3, "Lendário", "Derrote 100 Pokémons", legend],
  [4, "Superstriker", "Derrote 200 Pokémons", superstriker],
  [5, "Master Trainer", "Derrote 500 Pokémons", master],
  [6, "Campeão Supremo", "Derrote 1000 Pokémons", champion],

  // Insígnias Geração I (com imagens locais)
  [7, "Boulder Badge", "Derrote o 1º Chefe (Rochoso)", InsigniaRocha],
  [8, "Cascade Badge", "Derrote o 2º Chefe (Aquático)", InsigniaCascata],
  [9, "Thunder Badge", "Derrote o 3º Chefe (Elétrico)", InsigniaTrovao],
  [10, "Rainbow Badge", "Derrote o 4º Chefe (Arco-Íris)", InsigniaArcoRis],
  [11, "Soul Badge", "Derrote o 5º Chefe (Psíquico)", InsigniaAlma],
  [12, "Marsh Badge", "Derrote o 6º Chefe (Pântano)", InsigniaPantano],
  [13, "Volcano Badge", "Derrote o 7º Chefe (Vulcânico)", InsigniaVulcano],
  [14, "Earth Badge", "Derrote o 8º Chefe (Terrestre)", InsigniaTerrestre],

  [15, "Primeira Evolução", "Evolua seu 1º Pokémon", vo1],
  [16, "Evoluidor Experiente", "Evolua 3 Pokémons", evo3],
  [17, "Ascensão Lv.50", "Alcance Nível 50 com qualquer Pokémon", lv50],
  [18, "Ascensão Lv.100", "Alcance Nível 100 com qualquer Pokémon", lv100],
];

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [userPokemons, setUserPokemons] = useState([]);
  const [userAchieves, setUserAchieves] = useState([]);

  // pega cookie e conquistas
  // 1) Carrega o usuário do cookie e, em seguida, busca as conquistas reais na API
  useEffect(() => {
    const c = Cookies.get("currentUser");
    if (!c) return router.push("/");
    const u = JSON.parse(c);
    setUser(u);

    // busca perfil completo
    fetch(`${API_URL}/usuarios/${u.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Falha ao carregar perfil");
        return res.json();
      })
      .then((data) => {
        // data.achievements deve ser array de IDs
        setUserAchieves(data.achievements || []);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [router]);

  // carrega pokémons do usuário + dados da PokeAPI
  useEffect(() => {
    if (!user) return;
    (async () => {
      const res = await fetch(`${API_URL}/user_pokemons?user_id=${user.id}`);
      if (!res.ok) return;
      const ups = await res.json();
      const enriched = await Promise.all(
        ups.map(async (up) => {
          const r = await fetch(`${POKEAPI}${up.pokemon_id}`);
          const j = await r.json();
          const sprite =
            j.sprites.versions["generation-v"]["black-white"].animated.front_default ||
            j.sprites.other["official-artwork"].front_default ||
            j.sprites.front_default;
          const types = j.types.map((t) =>
            t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1)
          );
          const stats = j.stats.reduce((acc, s) => {
            acc[s.stat.name] = s.base_stat;
            return acc;
          }, {});
          return {
            ...up,
            name: j.name.charAt(0).toUpperCase() + j.name.slice(1),
            sprite,
            types,
            height: (j.height / 10).toFixed(1),
            weight: (j.weight / 10).toFixed(1),
            stats,
          };
        })
      );
      setUserPokemons(enriched);
    })();
  }, [user]);

  if (!user) return <p>Carregando…</p>;

  return (
    <>
      <GradientBackground />
      <div className="max-w-full p-48 mx-auto py-24 space-y-12 font-[geist] bg-gray-900 z-100">
        <div className="flex justify-between items-center z-100">
          <div className="z-100">
            <h1 className="text-4xl font-bold z-100 text-white">Olá, {user.name}!</h1>
            <p className="mt-1 text-gray-300 z-100">
              Pokémons derrotados: <strong>{user.totalEnemiesKills}</strong>
            </p>
          </div>
          <Button className={"z-100"} variant="destructive" onClick={() => {
            Cookies.remove("currentUser");
            router.push("/");
          }}>
            Sair
          </Button>
        </div>

        {/* Mochila */}
        <section className="z-100">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 z-100">
            {userPokemons.map((p, i) => {
              const primary = TYPE_COLORS[p.types[0]] || TYPE_COLORS.Normal;
              const secondary = TYPE_COLORS[p.types[1]] || primary;
              const gradient = `linear-gradient(135deg, ${primary}, ${secondary})`;

              return (
                <motion.div
                  key={p.pokemon_id}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: i * 0.1, type: "spring", stiffness: 120 }}
                  whileHover={{ scale: 1.03 }}
                  className="rounded-xl shadow-lg overflow-hidden bg-white/30 text-card-foreground border border-gray-300 z-100"
                >
                  <div className="p-4 text-gray-900 flex items-center z-100">
                    <img src={p.sprite} alt={p.name} className="w-28 h-28 object-contain" />
                    <div className="ml-4 text-gray-900">
                      <h3 className="text-2xl font-bold">{p.name}</h3>
                      <p className="mt-1">Lvl {p.level}</p>
                      <div className="mt-2 flex gap-2">
                        {p.types.map((t) => (
                          <span
                            key={t}
                            className={cn(
                              "px-2 py-1 rounded-full text-xs font-medium text-white",
                              TYPE_COLORS[t] || TYPE_COLORS.Normal
                            )}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-2 flex justify-between bg-white/40">
                    <div className="text-sm">
                      <p>{p.height} m</p>
                      <p className="mt-1">{p.weight} kg</p>
                    </div>
                    <div className="text-sm">
                      <p>HP: {p.current_hp}</p>
                      <p>XP: {p.xp}</p>
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    {Object.entries(p.stats).map(([stat, val]) => (
                      <div key={stat}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="capitalize">{stat.replace("-", " ")}</span>
                          <span>{val}</span>
                        </div>
                        <Progress value={val} max={355} className="h-2 rounded-full" />
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Conquistas */}
        <section>
          <h2 className="text-2xl mb-4 text-white">Conquistas</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {ACHIEVEMENTS.map(([id, name, desc, icon]) => {
              const earned = userAchieves.includes(id);
              return (
                <motion.div
                  key={id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: id * 0.02 }}
                  className={cn(
                    "flex flex-col items-center p-2 rounded-lg shadow z-100",
                    earned
                      ? "bg-white"
                      : "bg-white/30 filter grayscale"
                  )}
                >
                  <Image
                    width={64}
                    height={64}
                    src={icon}
                    alt={name}
                    className="mb-2"
                  />
                  <h4 className="text-sm font-semibold text-center">{name}</h4>
                  <p className="text-xs text-gray-700 text-center">{desc}</p>
                </motion.div>
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
}
