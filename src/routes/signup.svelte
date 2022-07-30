<script>
  import ErrorMessage from "$lib/components/error-message.svelte";
  import {fetchPost} from "$lib/fetch";

  let email;
  let password;
  let err;
  let success = false;

  async function onSignup() {
    const { error } = await fetchPost("/api/user/signup", {
        email,
        password
      });
    if (error) {
      err = error;
      //console.log(error);
      return;
    }
    success = true;
  }
</script>
  
<svelte:head>
  <title>Signup - Groupomania</title>    
</svelte:head>

<ErrorMessage error={err} />
{#if success}
  <div class="alert alert-success">
    Signup successfull.
    <a href="/">Please Log In</a>
  </div>
{/if}

<form on:submit|preventDefault={onSignup}>
  <div class="mb-3">
    <label for="email" class="form-label">Email address</label>
    <input bind:value={email} type="email" class="form-control" id="email" aria-describedby="emailHelp" />
    <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
  </div>
  <div class="mb-3">
    <label for="password" class="form-label">Password</label>
    <input
      bind:value={password}
      type="password"
      class="form-control"
      id="password"
      minlength="8"
      />
  </div>
  <button type="submit" class="btn btn-primary">Signup</button>
</form>