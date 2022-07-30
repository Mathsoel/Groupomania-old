import mongoose from "mongoose";
import { MONGODB_URI } from "$lib/env";



// CONNECTION À DATABASE MONGODB
export async function initDb() {
  if (mongoose.connection.readyState === 1) return null;    // ??
  try {
    await mongoose.connect(MONGODB_URI);
    return null;
  } catch (error) {
    return error;
  }
}
