import { initDb } from "$lib/db";
import { User } from "$lib/schemas/user";
import { CRYPTED_PASSWORD } from "$lib/env";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// route POST /api/user/login
export async function POST({ request }) {
  // initialise connexion base de données
  const dbError = await initDb();

  // si erreur, on renvoie une réponse avec le message d'erreur de connexion
  if (dbError) {
    return sendResponse(false, null, null, dbError.message);
  }
  
  try {
    // récupération des données POST
    const { email, password } = await request.json();
    // on chercher sur la BDD un utilisateur ayant l'email saisi sur le formulaire de login
    const user = await User.findOne({ email });

    // s'il n'existe pas, on renvoie un message d'erreur
    if (!user) return sendResponse(false, null, null, "User unregistered");
    // on teste la validité du mot de passe saisi
    const passwordCorrect = await bcrypt.compare(password, user?.password);
    // s'il ne l'est pas, on renvoie un message d'erreur
    if (!passwordCorrect) {
      return sendResponse(false, null, null, "Incorrect Password");
    }

    // on créé un token JWT pour valider l'identité de l'utilisateur
    const token = createToken({ email, userId: user?.id, admin: user?.admin });
    // on renvoie les informations pour le localstorage et le userStore
    return sendResponse(user?.admin, user?.id, token, null);
  } catch (err) {
    // en cas d'erreur, on renvoie le message d'erreur
    console.error(err);
    return sendResponse(false, null, null, err.message);
  }
}

function createToken(payload) {
  const token = jwt.sign(payload, CRYPTED_PASSWORD, {
    expiresIn: "24h"
  }); // {expiresIn:'24h'} {expiresIn:'1000ms'}
  // console.log('token', token)
  return token;
}

// fonction pour simplifier la réponse des endpoints sveltekit
function sendResponse(admin, userId, token, error) {
  return {
    body: {
      admin,
      userId,
      token,
      error
    }
  };
}
