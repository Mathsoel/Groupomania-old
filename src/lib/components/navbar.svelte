<script>
  import { createEventDispatcher } from "svelte";

  // propriété disponible pour le composant parent
  export let logged;
  // création d'un dispacteur d'évènement pour remonter un évènement à l'élément parent
  const dispatch = createEventDispatcher();
  // condition d'affichage du menu sur modèle
  let mobileMenuOpened = false;

  function logout() {
    // fais remonter l'évènement "logout" au parent
    dispatch("logout");
  }
</script>

<nav class="navbar navbar-expand-lg bg-light">
  <div class="container-fluid">
    <a class="navbar-brand" href="/">
      <img height="48" width="220" src="/icon-left-font-monochrome-black.png" id="logoImage" alt="imagePreview" />
      
    </a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
        on:click={() => mobileMenuOpened = !mobileMenuOpened}
      >
        <span class="navbar-toggler-icon" />
      </button>
      <div class="{mobileMenuOpened ? '' : 'collapse'} navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <a class="nav-link" aria-current="page" href="/">Login</a>
          </li>
          {#if logged}
            <li class="nav-item">
              <!-- exécute la fonction logout au clic -->
              <button class="nav-link border-0 bg-transparent" on:click={logout}>
                Log out
              </button>
            </li>
          {:else}
          <li class="nav-item">
            <a class="nav-link" href="/signup">
              Sign up
            </a>
          </li>
          {/if}
        </ul>
    </div>
  </div>
</nav>
