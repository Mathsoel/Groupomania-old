<script>
  import MessageForm from "$lib/components/message-form-create.svelte";
  import Message from "$lib/components/message.svelte";
  import ErrorMessage from "$lib/components/error-message.svelte";
  import { fetchGet } from '$lib/fetch';
  import { onMount } from "svelte/internal";

  let messages = [];
  let err = "";

  // va requérir les messages sur le back
  async function getMessages() {
    const data = await fetchGet("/api/message");
    // si il y a des messages dans la base de données, on modifie notre variable
    messages = data.messages;
    // s'il y a un message d'erreur, on l'affiche
    if (data?.error?.length) err = data.error;
  }

  // à l'initialisation de la page
  onMount(async () => {
    // on va requérir les messages sur le back
    await getMessages();
  });
</script>

<svelte:head>
  <title>Wall - Groupomania</title>
</svelte:head>

<ErrorMessage error={err} />

<!-- composant formulaire pour écrire les messages == actualisation des messages-->
<MessageForm on:sent={getMessages} />

<!-- s'il y a des messages -->
{#if messages.length}
<!-- on boucle sur les messages -->
  {#each messages as message}
  <!-- et on les affiche -->
    <Message
      on:delete={getMessages}
      on:interaction={getMessages}
      messageData={message}
    />
  {/each}
{:else}
  <p>Il n'y a aucun message</p>
{/if}
