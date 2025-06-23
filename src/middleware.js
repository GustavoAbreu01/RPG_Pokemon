// middleware.js
import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("currentUser");

  // 1) sempre libera assets e _next
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/static/")
  ) {
    return NextResponse.next();
  }

  // 2) rotas públicas de login / registro
  const isLoginPage = pathname === "/";
  const isRegisterPage = pathname === "/pages/register";

  if (!token) {
    // não logado → só permite login e register
    if (isLoginPage || isRegisterPage) {
      return NextResponse.next();
    }
    // qualquer outra rota manda pra login
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 3) logado → não deixa voltar a login/register
  if (isLoginPage || isRegisterPage) {
    return NextResponse.redirect(new URL("/menu", request.url));
  }

  // 4) logado e rota protegida → libera
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",            // login
    "/pages/register",    // cadastro
    "/menu",        // menu principal
    "/pages/game/:path*", // todas as rotas de jogo
    "/pages/profile"      // perfil
  ],
};
