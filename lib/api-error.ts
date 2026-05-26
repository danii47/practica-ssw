export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly fields?: Record<string, string>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Petición incorrecta.', fields?: Record<string, string>) {
    super(400, message, fields);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'No autenticado.') {
    super(401, message);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Acceso denegado.') {
    super(403, message);
  }
}

export class NotFoundError extends AppError {
  constructor(resource = 'Recurso') {
    super(404, `${resource} no encontrado.`);
  }
}

export class ConflictError extends AppError {
  constructor(message: string, fields?: Record<string, string>) {
    super(409, message, fields);
  }
}

export class UnprocessableError extends AppError {
  constructor(message: string, fields?: Record<string, string>) {
    super(422, message, fields);
  }
}
