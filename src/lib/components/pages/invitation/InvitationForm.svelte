<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { KuInput, KuSelect, KuButton } from "$lib/components/form";

  interface InvitationData {
    email: string;
    role: string;
  }

  interface InvitationErrors {
    email: string;
    role: string;
  }

  export let invitation: InvitationData = {
    email: "",
    role: "",
  };

  export let errors: InvitationErrors = {
    email: "",
    role: "",
  };

  export let loading: boolean = false;

  const dispatch = createEventDispatcher<{
    submit: InvitationData;
    cancel: void;
  }>();

  function handleSubmit(): void {
    dispatch("submit", invitation);
  }

  function handleCancel(): void {
    dispatch("cancel");
  }

  interface RoleOption {
    name: string;
    value: string;
  }

  const rolesOptions: RoleOption[] = [
    { name: "Admin", value: "admin" },
    { name: "User", value: "user" },
  ];

  function toggleRole(role: string): void {
    invitation.role = role;
  }
</script>

<form on:submit|preventDefault={handleSubmit}>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <KuInput
      name="email"
      dataType="email"
      label="Email"
      bind:value={invitation.email}
      isRequired={true}
      error={errors.email}
    />
    <KuSelect
      name="role"
      dataType="text"
      label="Papel"
      bind:value={invitation.role}
      options={rolesOptions}
      on:change={() => toggleRole(invitation.role)}
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
      actionType="reset"
      variant="secondary"
      on:click={handleCancel}
    />
  </div>
</form>
