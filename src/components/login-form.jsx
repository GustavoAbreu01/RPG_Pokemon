// components/LoginForm.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { cn } from "../lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card, CardContent,
  CardDescription,
  CardHeader, CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function LoginForm({ className, ...props }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `${API_URL}/usuarios?name=${encodeURIComponent(name.trim())}`
      );
      if (!res.ok) {
        // se o usuário não existir, vamos mandar pra tela de cadastro
        return router.push("/pages/register?name=" + encodeURIComponent(name.trim()));
      }
      const user = await res.json();

      // grava o usuário no cookie por 7 dias
      Cookies.set("currentUser", JSON.stringify(user), {
        expires: 7,
        path: "/",
      });

      // e aí manda pra página de perfil
      router.push("/pages/profile");
      window.location.reload();
    } catch (err) {
      setError(err.message || "Erro ao realizar login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6 z-10", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Digite seu nome para entrar</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                type="text"
                placeholder="Seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Entrando..." : "Entrar"}
            </Button>

            <Button
              variant="outline"
              type="button"
              onClick={() => router.push("/pages/register")}
              className="w-full"
            >
              Cadastrar-se
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
