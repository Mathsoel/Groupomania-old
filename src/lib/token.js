import { CRYPTED_PASSWORD } from "$lib/env";
import jwt from "jsonwebtoken";

/**
 *
 * @param {string} token
 */
export function verifyToken(token) {
  return jwt.verify(token, CRYPTED_PASSWORD);
}

export function authenticate(token, userId) {
  try {
    const payload = verifyToken(token);
    if (userId?.length > 0 && payload?.userId === userId) {
      return true;
    }
    return false;
  } catch (_) {
    return false;
  }
}
