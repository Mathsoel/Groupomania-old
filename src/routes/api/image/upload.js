import { writeFileSync } from "fs";

export async function POST({ request }) {
  // on récupère la description de l'image et son nom
  const { image, name } = await request.json();
  // on écrit le fichier image dans le dossier statique
  writeFileSync(`static/images/${name}`, image, "base64");
  // on renvoie l'url de l'image
  return {
    body: {
      url: `/images/${name}`
    }
  };
}
