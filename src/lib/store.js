import { browser } from "$app/env";
import { writable } from "svelte/store";

// par défaut l'utilisateur est vide
const defaultUserValue = {
  userId: "",
  admin: false,
  token: ""
};
// si exécute côté client (navigateur) on cherche à récupérer les informations contenues dans le local storage
const initialUserValue = browser
  ? JSON.parse(window.localStorage.getItem("user"))
  : null;

// initialisation du store avec la valeur par défaut
export const userStore = writable(initialUserValue || defaultUserValue);

// souscription à toute modification du store
userStore.subscribe((value) => {
  // si exécuté côté client (navigateur)
  if (browser) {
    // on modifie le local storage avec la nouvelle valeur du store
    if (value) window.localStorage.setItem("user", JSON.stringify(value));
    else window.localStorage.removeItem("user");
  }
});
