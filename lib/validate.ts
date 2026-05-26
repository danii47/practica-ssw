export type ValidationError = Record<string, string>;

export function validateRegisterInput(body: Record<string, unknown>): ValidationError | null {
  const errors: ValidationError = {};

  if (!body.email || typeof body.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    errors.email = 'Email inválido.';
  }
  if (!body.username || typeof body.username !== 'string' || body.username.length < 3 || body.username.length > 20) {
    errors.username = 'El nombre de usuario debe tener entre 3 y 20 caracteres.';
  }
  if (body.username && typeof body.username === 'string' && !/^[a-zA-Z0-9_]+$/.test(body.username)) {
    errors.username = 'El nombre de usuario solo puede contener letras, números y guiones bajos.';
  }
  if (!body.password || typeof body.password !== 'string' || body.password.length < 8) {
    errors.password = 'La contraseña debe tener al menos 8 caracteres.';
  }
  if (!body.name || typeof body.name !== 'string' || body.name.trim().length < 1 || body.name.length > 15) {
    errors.name = 'El nombre es obligatorio (máx. 15 caracteres).';
  }
  if (!body.surnames || typeof body.surnames !== 'string' || body.surnames.trim().length < 1 || body.surnames.length > 30) {
    errors.surnames = 'Los apellidos son obligatorios (máx. 30 caracteres).';
  }
  if (!body.country || typeof body.country !== 'string' || body.country.trim().length < 1) {
    errors.country = 'El país es obligatorio.';
  }
  if (!body.born_date || typeof body.born_date !== 'string' || isNaN(Date.parse(body.born_date))) {
    errors.born_date = 'Fecha de nacimiento inválida.';
  } else {
    const age = (Date.now() - new Date(body.born_date).getTime()) / (1000 * 60 * 60 * 24 * 365.25);
    if (age < 16) errors.born_date = 'Debes tener al menos 16 años.';
  }

  return Object.keys(errors).length > 0 ? errors : null;
}

export function validateLoginInput(body: Record<string, unknown>): ValidationError | null {
  const errors: ValidationError = {};
  if (!body.email || typeof body.email !== 'string') errors.email = 'Email requerido.';
  if (!body.password || typeof body.password !== 'string') errors.password = 'Contraseña requerida.';
  return Object.keys(errors).length > 0 ? errors : null;
}
