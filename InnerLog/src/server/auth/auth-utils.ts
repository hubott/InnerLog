// src/server/auth/auth-utils.ts
import bcrypt from "bcrypt";

// Hash a password before saving it to DB
export async function hashPassword(password: string) {
  const hashed = await bcrypt.hash(password, 10);
  return hashed;
}

// Compare plain password with hashed password in DB
export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}
