<!-- Messages d' Alertes  -->

<script>
  export let error = "";  // valeur par défaut
</script>

{#if error.length}
  <div class="alert alert-danger" role="alert">
    {error}
  </div>
{/if}
