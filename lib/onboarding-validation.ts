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
