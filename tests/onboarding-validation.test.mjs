import assert from "node:assert/strict";
import test from "node:test";
import { validateAccessContact, validateChileanRut, validateDeclaredProfile } from "../lib/onboarding-validation.ts";

test("email exige una forma mínima completa", () => {
  assert.equal(validateAccessContact("email", "persona@example.com").valid, true);
  assert.equal(validateAccessContact("email", " persona@example.cl ").valid, true);
  for (const value of ["", "persona", "persona@", "@example.com", "persona example.com"]) {
    assert.equal(validateAccessContact("email", value).valid, false, value);
  }
});

test("teléfono acepta formato humano pero exige 8 a 15 dígitos", () => {
  assert.equal(validateAccessContact("teléfono", "+56 9 1234 5678").valid, true);
  assert.equal(validateAccessContact("teléfono", "(02) 2345-6789").valid, true);
  for (const value of ["", "123", "+56 ABC 123", "+1234567890123456"]) {
    assert.equal(validateAccessContact("teléfono", value).valid, false, value);
  }
});

test("los errores indican cómo corregir sin afirmar existencia de cuenta", () => {
  const email = validateAccessContact("email", "persona@");
  const phone = validateAccessContact("teléfono", "123");
  assert.match(email.error, /formato/i);
  assert.match(phone.error, /8 y 15 dígitos/i);
  assert.doesNotMatch(`${email.error} ${phone.error}`, /cuenta|registrad|existe/i);
});

test("RUT valida formato y dígito verificador sin afirmar KYC", () => {
  for (const value of ["11.111.111-1", "12.345.678-5", "7.654.321-6"]) {
    assert.equal(validateChileanRut(value).valid, true, value);
  }
  for (const value of ["", "123", "11.111.111-2", "12.345.678-9"]) {
    assert.equal(validateChileanRut(value).valid, false, value);
  }
  assert.doesNotMatch(validateChileanRut("11.111.111-2").error, /identidad verificada|KYC aprobado/i);
});

test("perfil declarado exige nombre y RUT válidos", () => {
  assert.equal(validateDeclaredProfile("Persona demo", "11.111.111-1").valid, true);
  assert.equal(validateDeclaredProfile("", "11.111.111-1").valid, false);
  assert.equal(validateDeclaredProfile("Persona demo", "11.111.111-2").valid, false);
});
