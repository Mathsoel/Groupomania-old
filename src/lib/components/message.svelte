<script>
  import { createEventDispatcher } from "svelte";
  import { userStore } from "$lib/store";
  import { fetchPut, fetchDelete } from "$lib/fetch";

  // propriété: le message et ses informations
  export let messageData;
  let err = "";
  const dispatch = createEventDispatcher();

  let user;
  // actualisation de la variable user = permet de recuperer ce qu'/// dans le store
  userStore.subscribe(usr => (user = usr));

  async function onDelete() {
    // DELETE /api/message/{identifiant du message}
    const { error } = await fetchDelete(`/api/message/${messageData._id}`, {
      user
    });
    // si erreur, on affiche le message
    if (error?.length) {
      err = error;
      return;
    }
    // on prévient le parent que le message a été supprimé
    dispatch("delete");
  }

  async function interaction(interaction) {
    const { error } = await fetchPut(
      `/api/message/${messageData._id}/interaction`,
      {
        user,
        interaction
      }
    );
    if (error?.length) {
      err = error;
      return;
    }
    dispatch("interaction");
  }
</script>

<style>
  img {
    max-height: 200px;
  }
</style>


<!-- s'il y a bien un message -->
{#if messageData?.message}
  <div class="card mb-4">
    <div class="row g-0">
      <!-- s'il y a une image associée au message -->
      {#if messageData?.imageUrl?.length}
        <!-- on affiche l'image -->
        <div class="col-md-4 text-center">
          <img
            src={messageData.imageUrl}
            class="img-fluid rounded-start object-fit-cover"
            alt={messageData?.imageAlt}
          />
        </div>
      {/if}
      <div class={messageData?.imageUrl?.length ? "col-md-8" : ""}>
        <div class="card-body">
          <blockquote class="blockquote mb-0">
            <!-- le message -->
            <p>{messageData?.message}</p>
          </blockquote>
          <!-- la date -->
          {#if messageData?.date}
            <p class="card-text">
              <small class="text-muted">
                <!-- affichage de la date au format local -->
                {new Date(parseInt(messageData.date)).toLocaleString()}
              </small>
            </p>
          {/if}
        </div>
      </div>
      <div class="card-footer">
        <!-- si l'utilisateur connecté est l'auteur du message ou admin -->
        {#if messageData?.userId == user?.userId || user?.admin}
          <!-- peut aller à la page d'édition du message -->
          <a href="/message/edit/{messageData._id}" class="btn btn-sm btn-white">
            Modifier
          </a>
          <!-- peut supprimer le message -->
          <button class="btn btn-sm btn-white me-3" on:click={onDelete}>
            Supprimer
          </button>
        {/if}
        <button class="btn btn-sm btn-white" on:click={() => interaction(1)}>
          Like ({messageData?.usersLiked?.length || 0})
        </button>
        <button class="btn btn-sm btn-white" on:click={() => interaction(-1)}>
          Dislike ({messageData?.usersDisliked?.length || 0})
        </button>
        {#if err.length}
          <span class="text-danger">{err}</span>
        {/if}
      </div>
    </div>
  </div>
{/if}
