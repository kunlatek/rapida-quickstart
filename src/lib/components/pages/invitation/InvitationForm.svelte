<script>
  import { createEventDispatcher } from "svelte";
  import { KuInput, KuSelect, KuButton } from "$lib/components/form";

  export let invitation = {
    email: "",
    role: "",
  };

  const dispatch = createEventDispatcher();

  export let errors = {
    email: "",
    role: "",
  };
  export let loading = false;

  function handleSubmit() {
    dispatch("submit", invitation);
  }

  function handleCancel() {
    dispatch("cancel");
  }

  const rolesOptions = [
    { name: "Admin", value: "admin" },
    { name: "User", value: "user" },
  ];

  /**
   * Toggle the role of the invitation
   * @param {any} role - The role to toggle
   */
  function toggleRole(role) {
    invitation.role = role;
  }
</script>

<form on:submit|preventDefault={handleSubmit}>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <KuInput
      name="email"
      label="Email"
      bind:value={invitation.email}
      isRequired={true}
      error={errors.email}
    />
    <KuSelect
      name="role"
      label="Papel"
      bind:value={invitation.role}
      options={rolesOptions}
      on:change={toggleRole}
      isRequired={true}
      error={errors.role}
    />
  </div>
  
  <div class="flex justify-end space-x-4 mt-8 px-4">
    <KuButton
      id="submit-button"
      label={loading ? "Enviando..." : "Enviar"}
      actionType="submit"
      isDisabled={loading}
    />
    <KuButton
      id="cancel-button"
      label="Cancelar"
      actionType="button"
      variant="secondary"
      on:click={handleCancel}
    />
  </div>
</form>
