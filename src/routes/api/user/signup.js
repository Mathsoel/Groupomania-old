import { initDb } from "$lib/db";
import { User } from "$lib/schemas/user.js";
import bcrypt from "bcrypt";

export async function POST({ request }) {
  const dbError = await initDb();
  if (dbError) {
    return {
      body: {
        error: dbError
      }
    };
  }
  let error = null;

  try {
    const { email, password } = await request.json();
    if (!/^[A-Za-z0-9+_.-]+@(.+)\.[a-zA-Z0-9]+$/.test(email)) {
      return {
        body: {
          error: "Wrong email"
        }
      }
    }
    const encryptedPassword = await encryptPassword(password);
    const user = new User({ email, password: encryptedPassword });
    await user.save();
  } catch (err) {
    error = err;
  }
  return {
    body: {
      error
    }
  };
}

function encryptPassword(password) {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}
