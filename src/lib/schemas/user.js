// DATABASE USER SCHEMA - IMPOSÉ PAR WRAPPER MONGOOSE 

import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

export const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  admin: { type: Boolean, required: false }
});
userSchema.plugin(uniqueValidator);
export const User = mongoose.model("User", userSchema);
