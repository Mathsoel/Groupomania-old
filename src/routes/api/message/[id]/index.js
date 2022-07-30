import { initDb } from "$lib/db";
import { Message } from "$lib/schemas/message.js";
import { authenticate } from "$lib/token";
import { unlinkSync } from "fs";

// DELETE /api/message/{identifiant du message}
export async function DELETE({ request, params }) {
  // si l'id existe
  if (params?.id?.length < 1) {
    return { body: { error: "No ID" } };
  }
  // on récupère les données de l'utilisateur envoyées par le front
  const { user } = await request.json();
  // authentifier l'utilisateur avec le token
  if (!authenticate(user?.token, user?.userId)) {
    return { body: { error: "Not logged in" } };
  }
  // initialiser la BDD
  const dbError = await initDb();
  if (dbError) {
    return { body: { error: dbError } };
  }

  try {
    // on cherche le message correspondant à l'id en paramètre de l'URL
    const message = await Message.findById(params.id);
    // s'il est admin, on passe à la suite
    if (!user?.admin) {
      // sinon on vérifie qu'il est bien l'auteur du message
      if (message?.userId !== user?.userId) {
        return { body: { error: "Not message owner" } };
      }
    }
    // on supprime le message
    await Message.findByIdAndDelete(params.id);
    // on supprime l'image associée s'il y en a une
    if (message.imageUrl?.length) {
      unlinkSync(`static${message.imageUrl}`);
    }
    return {
      body: { error: null }
    };
  } catch (error) {
    // si erreur on envoie un message d'erreur
    return {
      body: { error: error.message }
    };
  }
}

export async function GET({ params }) {
  if (params?.id?.length < 1) {
    return { body: { error: "No ID" } };
  }
  const dbError = await initDb();
  if (dbError) {
    return { body: { error: dbError } };
  }

  try {
    const message = await Message.findById(params.id);
    return {
      body: { message, error: null }
    };
  } catch (error) {
    return {
      body: { error: error.message }
    };
  }
}

/**
 *
 * @param {*} param0
 */
export async function PUT({ request, params }) {
  if (params?.id?.length < 1) {
    return { body: { error: "No ID" } };
  }
  const { user, message } = await request.json();
  if (!authenticate(user?.token, user?.userId)) {
    return { body: { error: "Not logged in" } };
  }
  const dbError = await initDb();
  if (dbError) {
    return { body: { error: dbError } };
  }

  try {
    const mess = await Message.findById(params.id);
    if (!user?.admin) {
      if (mess?.userId !== user?.userId) {
        return { body: { error: "Not message owner" } };
      }
    }
    if (mess.imageUrl.length && mess.imageUrl !== message.imageUrl) {
      unlinkSync(`static${mess.imageUrl}`);
    }
    const updatedMessage = await Message.findByIdAndUpdate(params.id, message);
    return {
      body: { message: updatedMessage, error: null }
    };
  } catch (error) {
    return {
      body: { error: error.message }
    };
  }
}
