// lib/errors/MiddlewareNotFoundError.js

export class MiddlewareNotFoundError extends Error {
  constructor(message = "Recurso não encontrado ou acesso não autorizado") {
    super(message);
    this.name = "MiddlewareNotFoundError";
    // opcional: qualquer campo extra que queira
    this.status = 404;
  }
}
