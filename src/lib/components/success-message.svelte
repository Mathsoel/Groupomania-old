<script>
  export let message = "";
</script>

{#if message.length}
  <div class="alert alert-success" role="alert">
    {message}
  </div>
{/if}
