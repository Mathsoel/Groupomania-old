// DATABASE MESSAGE SCHEMA - IMPOSÉ PAR WRAPPER MONGOOSE 

import mongoose from "mongoose";

export const messageSchema = new mongoose.Schema({
  userId: String,
  date: String,
  imageUrl: String,
  imageAlt: String,
  message: String,
  usersLiked: [String],
  usersDisliked: [String]
});

export const Message = mongoose.model("Message", messageSchema);
