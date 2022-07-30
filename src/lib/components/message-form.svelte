<script>
  import { createEventDispatcher } from "svelte";
  import { fetchPost } from "$lib/fetch";
  import ErrorMessage from "$lib/components/error-message.svelte";
  import SuccessMessage from "$lib/components/success-message.svelte";

  const messageMinLength = 10;

  // variable bindée à l'input mais qui est aussi une prop
  // pour que le parent puisse se binder aussi
  export let message;
  export let imagePreview = "";
  // bindée à l'input file de l'image
  let imageInput;
  let imageName;
  export let error = "";
  export let success = "";

  const dispatch = createEventDispatcher();

  function onImageInputChange() {
    // on récupère le premier fichier des files de l'input file = l'image
    const file = imageInput.files[0];
    // vérifier que ce soit bien une image
    if (!/^image\//.test(file.type)) {
      alert("pas une image");
      return;
    }
    // vérifier que l'image ne soit pas trop lourde
    if (file.size > 1000000) {
      alert("trop lourde");
      return;
    }
    // renommage du fichier
    nameTheFile(file);
    // instanciation du lecteur de fichier
    const reader = new FileReader();
    // une fois la lecture du fichier terminée
    reader.addEventListener("load", function() {
      // afficher l'image dans l'espace preview
      imagePreview = reader.result;
    });
    // lancer la lecture du fichier et execute "load"
    reader.readAsDataURL(file);
  }

  function nameTheFile(file) {
    imageName = `${Date.now()}-${file.name}`.replace(/\s/g, "-"); // .replace(/\s/g, "-") remplace les espaces par des tirets
  }

  // https://www.programonaut.com/how-to-create-a-sveltekit-image-upload-step-by-step/
  async function onSubmit() {
    // s'il y a une image
    if (imagePreview) {
      const imgData = imagePreview.split(",");
      // on envoie la description de l'image et son nom
      const { url } = await fetchPost(`/api/image/upload`, {
        image: imgData[1],
        name: imageName
      });
      // on prévient le parent que le formulaire est soumis avec l'url de l'image
      // url => event.detail dans le parent
      dispatch("submit", url);
      // on réinitialise l'input file et l'aperçu
      imagePreview = "";
      imageInput.value = "";
      return;
    }
    // on prévient le parent que le formulaire est soumis sans url d'image
    dispatch("submit");
  }
</script>

<ErrorMessage {error} />
<SuccessMessage message={success} />

<form on:submit|preventDefault={onSubmit} class="mb-4">
  <div class="mb-3">
    <label for="exampleFormControlTextarea1" class="form-label">
      Message
    </label>
    <textarea
      required
      minlength={messageMinLength}
      class="form-control mb-3"
      id="exampleFormControlTextarea1"
      rows="3"
      bind:value={message}
    />
    <div class="mb-3">
      <label for="formFile" class="form-label">
        Default file input example
      </label>
      <!-- input de l'image -->
      <input
        type="file"
        accept="image/*"
        on:change={onImageInputChange}
        bind:this={imageInput}
      />
      <!-- s'il y a une image, on l'affiche avant envoi dans browser -->
      {#if imagePreview.length}
        <img src={imagePreview} alt="imagePreview" /> <!-- src: url de l'image / ou contenu de l'image en base64 -->
      {/if}
    </div>
  </div>
  <!-- conditionne l'activation du bouton au nombre de caractères du message -->
  <button
    disabled={message.length < messageMinLength}
    class="btn btn-primary w-100"
    type="submit">
    Envoyer
  </button>
</form>