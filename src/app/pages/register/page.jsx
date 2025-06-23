// pages/register.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Image from "next/image";
import { GradientBackground } from "@/components/animate-ui/backgrounds/gradient";
import logo from "../../assets/images/Gama.png";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const POKEAPI = "https://pokeapi.co/api/v2/pokemon/";
const CRY_BASE = "https://play.pokemonshowdown.com/audio/cries";

const STARTER_IDS = {
  gen1: [1, 4, 7],
  gen2: [152, 155, 158],
  gen3: [252, 255, 258],
};

// Framer Motion variants
const fadeIn = { hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0 } };
const slideIn = { hidden: { height: 0, opacity: 0 }, visible: { height: "auto", opacity: 1 } };

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefillName = searchParams.get("name") || "";

  const [name, setName] = useState(prefillName);
  const [sprites, setSprites] = useState({ gen1: [], gen2: [], gen3: [] });
  const [sel, setSel] = useState({ gen1: null, gen2: null, gen3: null });
  const [availableMoves, setAvailableMoves] = useState({});
  const [movesByStarter, setMovesByStarter] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Load starter sprites
  useEffect(() => {
    (async () => {
      const out = { gen1: [], gen2: [], gen3: [] };
      for (const gen of Object.keys(STARTER_IDS)) {
        out[gen] = await Promise.all(
          STARTER_IDS[gen].map(async (id) => {
            const res = await fetch(`${POKEAPI}${id}`);
            const j = await res.json();
            const sprite =
              j.sprites.other["showdown"].front_default ||
              j.sprites.other["showdown"].front_default;
            return { id, name: j.name, sprite };
          })
        );
      }
      setSprites(out);
    })();
  }, []);

  // Load moves when a starter is selected
  useEffect(() => {
    Object.values(sel).forEach((id) => {
      if (!id || availableMoves[id]) return;
      fetch(`${API_URL}/pokemons/${id}`)
        .then((r) => r.json())
        .then((p) =>
          setAvailableMoves((a) => ({ ...a, [id]: p.atacks }))
        )
        .catch(console.error);
    });
  }, [sel]);

  const handleSelect = (gen, p) => {
    new Audio(`${CRY_BASE}/${p.name}.mp3`).play().catch(() => { });
    setSel((s) => ({ ...s, [gen]: p.id }));
  };

  const toggleMove = (pid, mid) => {
    setMovesByStarter((m) => {
      const arr = m[pid] || [];
      let next;
      if (arr.includes(mid)) next = arr.filter((x) => x !== mid);
      else if (arr.length < 4) next = [...arr, mid];
      else next = arr;
      return { ...m, [pid]: next };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const starterIds = Object.values(sel);
    if (!name.trim() || starterIds.some((x) => !x)) {
      setError("Preencha seu nome e selecione 3 pokémons iniciais.");
      return;
    }
    for (let id of starterIds) {
      if (!(movesByStarter[id] || []).length) {
        setError("Selecione até 4 golpes para cada inicial.");
        return;
      }
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/usuarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          starters: starterIds,
          moves_by_starter: movesByStarter,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Falha no registro");
      }
      const user = await res.json();
      Cookies.set("currentUser", JSON.stringify(user), {
        expires: 7,
        path: "/",
      });
      router.push("/menu");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <GradientBackground />
      <Link href={"/"}>
        <Image src={logo} alt="Gama Academy" className="absolute top-6 left-6 z-10 w-10 h-auto" />
      </Link>
      <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 bg-gray-900 z-100 font-[geist]">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="min-w-5/5 mx-auto py-1 px-4 z-100"
        >
          <Card className={"z-30"}>
            <CardHeader>
              <CardTitle>Cadastro de Treinador</CardTitle>
              <CardDescription>
                Escolha seu nome, iniciais e golpes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6 flex flex-col items-center w-full">
                <div className={"w-2/4 flex flex-col gap-2 self-start"}>
                  <Label htmlFor="name">Seu Nome</Label>
                  <Input
                    id="name"
                    value={name}
                    className={"w-full"}
                    onChange={(e) => setName(e.target.value)}
                    required />
                </div>
                <div className="grid md:grid-cols-3 w-full gap-6">
                  {Object.keys(STARTER_IDS).map((gen, i) => (
                    <motion.div
                      key={gen}
                      variants={fadeIn}
                      className="border rounded-lg p-4 flex flex-col"
                    >
                      <div className="font-semibold text-white mb-2">
                        Inicial – Geração {i + 1}
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        {sprites[gen].map((p) => (
                          <motion.button
                            key={p.id}
                            type="button"
                            onClick={() => handleSelect(gen, p)}
                            className={cn(
                              "border rounded-lg p-2 flex flex-col items-center cursor-pointer justify-around w-full h-40",
                              sel[gen] === p.id
                                ? "border-primary border-3"
                                : "border-gray-200"
                            )}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Image
                              src={p.sprite}
                              alt={p.name}
                              width={80}
                              height={80}
                              className="object-contain mb-1 size-20" />
                            <span className="capitalize text-white">{p.name}</span>
                          </motion.button>
                        ))}
                      </div>
                      <motion.div
                        initial="hidden"
                        animate={sel[gen] ? "visible" : "hidden"}
                        variants={slideIn}
                        transition={{ duration: 0.4 }}
                        className="mt-4 overflow-y-auto scroll-smooth max-h-48"
                      >
                        <CardDescription>Selecione até 4 golpes:</CardDescription>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {availableMoves[sel[gen]]?.map(mv => (
                            <motion.div
                              key={mv.id}
                              onClick={() => toggleMove(sel[gen], mv.id)}
                              whileTap={{ scale: 0.95 }}
                              className={cn(
                                "border p-2 rounded-lg flex justify-between items-center cursor-pointer ",
                                (movesByStarter[sel[gen]] || []).includes(mv.id)
                                  ? "bg-primary text-white"
                                  : "bg-white"
                              )}
                            >
                              <span>{mv.name}</span>
                              <span className="text-sm font-semibold">
                                {mv.damage} Dano
                              </span>
                            </motion.div>
                          ))}
                        </div>
                        <p className="mt-2 text-right text-xs text-gray-500">
                          {(movesByStarter[sel[gen]] || []).length}/4
                        </p>
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
                {error && <p className="text-red-500">{error}</p>}
                <Button type="submit" disabled={loading} className="w-2/5">
                  {loading ? "Cadastrando..." : "Finalizar Cadastro"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
}