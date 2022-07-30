<script>
  import { createEventDispatcher } from "svelte";
  import { userStore } from "$lib/store";
  import { fetchPost } from "$lib/fetch";
  import MessageForm from "$lib/components/message-form.svelte";

  let message = "";
  let err = "";
  let success = "";
  let user = null;

  const dispatch = createEventDispatcher();

  // récupérer les informations sur l'utilisateur
  userStore.subscribe(async userData => (user = userData));

  async function onSubmit({ detail }) {
    err = "";
    // si l'utilisateur n'existe pas, message d'erreur
    if (!user) {
      err = "Not logged in";
      return;
    }
    // on envoie le contenu du message et les information de l'utilisateur au back
    const { error } = await fetchPost("/api/message", {
      message,
      // detail = l'url de l'image
      imageUrl: detail || "",
      user
    });
    if (error) {
      err = error;
      return;
    }
    // on réinitialise le formulaire
    message = "";
    success = "Message sent";
    // pour le parent, on prévient que le message a été envoyé
    dispatch("sent");
  }
</script>

{#if user}
  <MessageForm bind:message={message} on:submit={onSubmit} error={err} {success} />
{/if}