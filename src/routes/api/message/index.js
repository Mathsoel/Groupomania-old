import { initDb } from "$lib/db";
import { Message } from "$lib/schemas/message.js";
import { authenticate } from "$lib/token";

export async function POST({ request }) {
  const dbError = await initDb();
  if (dbError) {
    return {
      body: {
        error: dbError
      }
    };
  }

  try {
    // information du formulaire de création de message
    const { message, imageUrl, user } = await request.json();
    // on authentifie l'utilisation grâce à son token
    if (!authenticate(user?.token, user?.userId)) {
      return { body: { error: "Not logged in" } };
    }
    // on créé le message pour la BDD
    const mess = new Message({
      userId: user.userId,
      date: new Date().getTime(),
      imageUrl,
      imageAlt: "image post",
      message
    });
    // on sauvegarde le message en BDD
    await mess.save();
    // si pas d'erreur, on renvoie un message d'erreur null
    return {
      body: {
        error: null
      }
    };
  } catch (err) {
    return {
      body: {
        error: err.message
      }
    };
  }
}

// GET /api/message
export async function GET() {
  const dbError = await initDb();
  if (dbError) {
    return {
      body: {
        error: dbError
      }
    };
  }

  try {
    // on chercher sur la base de données les messages (ordre décroissant)
    const messages = await Message.find({}).sort({ date: -1 });
    // on les renvoie au front
    return {
      body: { messages }
    };
  } catch (error) {
    // sauf si erreur, on renvoie un message d'erreur
    return {
      body: { error: error.message }
    };
  }
}
