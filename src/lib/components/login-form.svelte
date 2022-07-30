<script>
  import { userStore } from "$lib/store";
  // fonctions de CRUD
  import { fetchPost } from "$lib/fetch";
  import ErrorMessage from "$lib/components/error-message.svelte";

  // à binder avec les inputs du formulaire de connexion
  // quand l'utilisateur modifie l'input, ça modifie la variable bindée
  let email = "";
  let password = "";

  let err = "";

  async function onSubmit() {
    err = "";
    // on vérifie dans le back les informaitons saisies par l'utilisateur
    const { admin, userId, token, error } = await fetchPost("/api/user/login", {
      email,
      password
    });
    // si on reçoit les informations de connexion de l'endpoint /api/user/login
    if (token && userId) {
      // alors on modifie le userStore (qui rempliera le localstorage)
      userStore.set({
        userId,
        token,
        admin
      });
      return;
    }
    // si on reçoit un message d'erreur, on l'affiche
    if (error) {
      err = error;
    }
  }
</script>

<ErrorMessage error={err} />

<!-- à la soumission du fomulaire, on exécute la fonction onSubmit -->
<!-- + "preventDefault" qui va annuler le comportement par défaut du formulaire => non rechargement de la page -->
<form on:submit|preventDefault={onSubmit}>
  <div class="mb-3">
    <label for="email" class="form-label">Email</label>
    <input
      type="email"
      class="form-control {err.length ? 'is-invalid' : ''}"
      id="email"
      bind:value={email}
    />
  </div>
  <div class="mb-3">
    <label for="password" class="form-label">Password</label>
    <input
      minlength="8"
      type="password"
      class="form-control {err.length ? 'is-invalid' : ''}"
      id="password"
      bind:value={password}
    />
  </div>
  <button type="submit" class="btn btn-primary ">Login</button>
 </form>
 