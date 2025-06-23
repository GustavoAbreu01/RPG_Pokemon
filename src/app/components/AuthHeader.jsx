"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Header from "./Header";

export default function AuthHeader() {
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    const user = Cookies.get("currentUser");
    setIsLogged(!!user);
  }, []);

  // Se não estiver logado, não renderiza nada
  if (!isLogged) return null;

  return <Header />;
}
