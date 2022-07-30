<script>
  import { page } from "$app/stores";
  import { onMount } from "svelte/internal";
  import MessageForm from "$lib/components/message-form-edit.svelte";
  import ErrorMessage from "$lib/components/error-message.svelte";
  import { fetchGet } from "$lib/fetch";
  import { goto } from "$app/navigation";

  let messageData;
  let err;

  function onEdited() {
    goto("/");
  }

  onMount(async () => {
    const { message, error } = await fetchGet(`/api/message/${$page.params.id}`);
    messageData = message;
    if (error?.length) err = error;
  });
</script>

<svelte:head>
  <title>Edit message - Groupomania</title>
</svelte:head>

<ErrorMessage error={err} />
{#if messageData}
  <MessageForm {messageData} on:sent={onEdited} />
{/if}