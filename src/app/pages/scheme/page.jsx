// app/(your-layout)/schema/page.tsx
"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import imageScheme from "../../assets/images/Diagrama_Pokemon.png";
import { GradientBackground } from "@/components/animate-ui/backgrounds/gradient";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function SchemaPage() {
  return (
    <>
      <GradientBackground />

      <div className="min-h-screen bg-gray-900 flex items-center justify-center pt-16 px-4">
        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          <motion.div
            className="flex items-center justify-center z-100"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Image
              src={imageScheme}
              alt="Diagrama de classes do Pokémon"
              className="rounded-xl shadow-lg w-full h-auto object-contain"
            />
          </motion.div>

          <motion.div
            className="space-y-8 z-100"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="text-4xl font-bold text-white">Esquema do Banco de Dados</h1>
            <p className="text-gray-300 max-w-prose">
              Este diagrama mostra as entidades centrais do nosso sistema Pokémon:
              como usuários, Pokémons, golpes, itens e conquistas se relacionam
              através de tabelas de junção. A seguir, uma breve descrição de cada
              parte.
            </p>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Usuário</CardTitle>
                <CardDescription className="text-gray-400">
                  Armazena nome, total de inimigos derrotados e total de derrotas.
                  Relaciona-se 1:N com <code>user_pokemons</code>, N:M com
                  <code>item</code> e 1:N via <code>user_achievements</code>.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Pokémon &amp; UserPokemon</CardTitle>
                <CardDescription className="text-gray-400">
                  A tabela <code>pokemon</code> guarda dados base (HP, ataque,
                  tipos, evolução) e muitos-para-muitos com golpes via
                  <code>pokemon_atacks</code>. Cada usuário tem instâncias mutáveis em
                  <code>user_pokemons</code>, onde nivel, XP e stats atuais são
                  registrados.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Atack &amp; Item</CardTitle>
                <CardDescription className="text-gray-400">
                  Golpes (<code>atack</code>) estão ligados a Pokémons base em
                  <code>pokemon_atacks</code>. Itens (<code>item</code>) são
                  associados a usuários via N:M em <code>user_items</code>.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Achievement</CardTitle>
                <CardDescription className="text-gray-400">
                  Cada conquista possui tipo (<code>kills</code>, <code>level</code>,
                  <code>evolution</code>, <code>fase</code>) e valor-limite. Quando
                  o usuário atinge, registra-se em <code>user_achievements</code>
                  com timestamp de desbloqueio.
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
}
