export type AccessMethod = "teléfono" | "email";

export type ContactValidation = { valid: true; error: null } | { valid: false; error: string };

export function validateAccessContact(method: AccessMethod, rawValue: string): ContactValidation {
  const value = rawValue.trim();
  if (!value) return { valid: false, error: method === "email" ? "Ingresa un email." : "Ingresa un número de teléfono." };

  if (method === "email") {
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    return valid ? { valid: true, error: null } : { valid: false, error: "Revisa el formato, por ejemplo nombre@dominio.cl." };
  }

  if (!/^\+?[\d\s()-]+$/.test(value)) return { valid: false, error: "Usa sólo números, espacios, paréntesis o guiones." };
  const digits = value.replace(/\D/g, "");
  return digits.length >= 8 && digits.length <= 15
    ? { valid: true, error: null }
    : { valid: false, error: "Ingresa entre 8 y 15 dígitos, incluyendo código de país si corresponde." };
}

export type DeclaredProfileValidation = {
  name: ContactValidation;
  rut: ContactValidation;
  valid: boolean;
};

function normalizeRut(rawValue: string): string {
  return rawValue.replace(/[^0-9kK]/g, "").toUpperCase();
}

export function validateChileanRut(rawValue: string): ContactValidation {
  const value = normalizeRut(rawValue);
  if (value.length < 8 || value.length > 9) return { valid: false, error: "Ingresa un RUT válido, por ejemplo 11.111.111-1." };

  const body = value.slice(0, -1);
  const checkDigit = value.slice(-1);
  let sum = 0;
  let multiplier = 2;
  for (let index = body.length - 1; index >= 0; index -= 1) {
    sum += Number(body[index]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }
  const remainder = 11 - (sum % 11);
  const expected = remainder === 11 ? "0" : remainder === 10 ? "K" : String(remainder);
  return expected === checkDigit
    ? { valid: true, error: null }
    : { valid: false, error: "Revisa el dígito verificador del RUT." };
}

export function validateDeclaredProfile(name: string, rut: string): DeclaredProfileValidation {
  const trimmedName = name.trim().replace(/\s+/g, " ");
  const nameValidation: ContactValidation = trimmedName.length >= 3 && /[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/.test(trimmedName)
    ? { valid: true, error: null }
    : { valid: false, error: "Escribe tu nombre tal como quieres verlo en YOL1." };
  const rutValidation = validateChileanRut(rut);
  return { name: nameValidation, rut: rutValidation, valid: nameValidation.valid && rutValidation.valid };
}
