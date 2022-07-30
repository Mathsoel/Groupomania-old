import { initDb } from "$lib/db";
import { Message } from "$lib/schemas/message.js";
import { authenticate } from "$lib/token";
/**
 *
 *
 */
export async function PUT({ request, params }) {
  if (params?.id?.length < 1) {
    return { body: { error: "No ID" } };
  }
  const { user, interaction } = await request.json();
  if (!authenticate(user?.token, user?.userId)) {
    return { body: { error: "Not logged in" } };
  }
  const dbError = await initDb();
  if (dbError) {
    return { body: { error: dbError } };
  }

  try {
    const message = await Message.findById(params.id);
    // initialiser les tableaux si ce n'est pas le cas
    if (!message.usersLiked?.length) message.usersLiked = [];
    if (!message.usersDisliked?.length) message.usersDisliked = [];
  
    // on regarde si l'utilisateur a aimé le message
    const hasLiked = message.usersLiked.includes(user.userId);
    // on regarde si l'utilisateur a pas aimé le message
    const hasDisliked = message.usersDisliked.includes(user.userId);

    // s'il a appuyé sur le bouton like
    if (interaction === 1) {
      // s'il avait déjà aimé, il n'aime plus
      if (hasLiked) {
        unlike(message, user);
      } else {
        // s'il avait déjà pas aimé, il ne désapprouve plus
        if (hasDisliked) {
          undislike(message, user);
        }
        // et il aime
        message.usersLiked.push(user.userId);
      }
    }

    // s'il a appuyé  sur le bouton dislike
    if (interaction === -1) {
      // s'il n'aimait pas
      if (hasDisliked) {
        // il ne désapprouve plus
        undislike(message, user);
      } else {
        // s'il aimait
        if (hasLiked) {
          // il n'aime plus
          unlike(message, user);
        }
        // et il désapprouve
        message.usersDisliked.push(user.userId);
      }
    }

    // et on met à jour le message
    await Message.findByIdAndUpdate(params.id, message);
    return {
      body: { error: null }
    };
  } catch (error) {
    return {
      body: { error }
    };
  }
}

// fonction simpliant la déspprobation
function unlike(message, user) {
  if (message.usersLiked.includes(user.userId)) {
    message.usersLiked.splice(message.usersLiked.indexOf(user.userId), 1);
  }
}

// fonction simplifiant l'approbation
function undislike(message, user) {
  if (message.usersDisliked.includes(user.userId)) {
    message.usersDisliked.splice(message.usersDisliked.indexOf(user.userId), 1);
  }
}
