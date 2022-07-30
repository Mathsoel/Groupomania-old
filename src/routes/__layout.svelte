<script>
  import LoginForm from "$lib/components/login-form.svelte";
  import Navbar from "$lib/components/navbar.svelte";
  import { page } from "$app/stores";
  import { userStore } from "$lib/store";
  import { fetchPost } from "$lib/fetch";
  const year = new Date().getFullYear();
  // récupérer info sur local storage
  let logged = false;


  // inscription aux modifications de l'utilisateur
  userStore.subscribe(async ({ userId, token }) => {
    // s'il existe (connecté)
    if (userId.length && token.length) {
      // on contrôle la validité des information du store avec le token
      const data = await fetchPost("/api/user/token", { token });
      if (data?.err) {
        console.error(data.err);
        return;
      }
      // après vérification, on considère l'utilisateur comme connecté
      if (data?.userId == userId) logged = true;
    } else {
      // cas pour la déconnexion
      logged = false;
    }
  });


  // log out 
  function logout() {
    // on définit des valeurs nulles pour l'utilisateur
    userStore.set({ userId: "", admin: false, token: "" });
  }
</script>


<!-- Ce qui sera contenu dans le <head /> -->
<svelte:head>
  {#if !logged && $page.routeId !== "signup"}
    <!-- Titre par défaut -->
    <title>Log in - Groupomania</title>
  {/if}
</svelte:head>


<!-- Menu / barre de navigation -->
<Navbar {logged} on:logout={logout} />

<div class="container mt-3">
  <!-- si connecté, on affiche les pages -->
  <!-- expection faite de la page signup -->
  {#if logged || $page.routeId == "signup"}
    <!-- slot = là où s'affiche la page -->
    <slot />
  {:else}
    <!-- sinon on affiche le formulaire de connexion -->
    <LoginForm />
  {/if}
</div>

<footer class="mt-5 mb-2 text-center">&copy; Mathias {year}</footer>
