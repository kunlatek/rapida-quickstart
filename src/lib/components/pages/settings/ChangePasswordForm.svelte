<script>
  import { createEventDispatcher } from "svelte";
  import { Button, Alert } from "flowbite-svelte";
  import { KuInput } from "$lib/components/form";
  import { userService } from "$services/user";
  import { toastStore } from "$stores/toast";

  let oldPassword = "";
  let newPassword = "";
  let confirmPassword = "";
  let loading = false;
  let error = "";
  let success = "";

  const dispatch = createEventDispatcher();

  async function handleSubmit() {
    // Reset messages
    error = "";
    success = "";

    // Validation
    if (!oldPassword || !newPassword || !confirmPassword) {
      error = "Por favor, preencha todos os campos";
      return;
    }

    if (newPassword !== confirmPassword) {
      error = "As novas senhas não coincidem";
      return;
    }

    if (newPassword.length < 8) {
      error = "A nova senha deve ter pelo menos 8 caracteres";
      return;
    }

    try {
      loading = true;
      await userService.changePassword(oldPassword, newPassword);
      success = "Senha alterada com sucesso!";
      toastStore.success("Senha alterada com sucesso!");

      // Reset form
      oldPassword = "";
      newPassword = "";
      confirmPassword = "";

      // Notify parent component
      dispatch("success");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Erro ao alterar senha. Tente novamente.";
      error = message;
      toastStore.error(message);
    } finally {
      loading = false;
    }
  }

  function handleCancel() {
    dispatch("cancel");
  }
</script>

<div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
  <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
    Alteração de Senha
  </h2>

  {#if error}
    <Alert color="red" class="mb-4">
      <span class="font-medium">Erro!</span>
      {error}
    </Alert>
  {/if}

  {#if success}
    <Alert color="green" class="mb-4">
      <span class="font-medium">Sucesso!</span>
      {success}
    </Alert>
  {/if}

  <form on:submit|preventDefault={handleSubmit} class="space-y-4">
    <KuInput
      name="oldPassword"
      dataType="password"
      label="Senha Atual"
      placeholder="••••••••"
      bind:value={oldPassword}
      isRequired={true}
    />

    <KuInput
      name="newPassword"
      dataType="password"
      label="Nova Senha"
      placeholder="••••••••"
      bind:value={newPassword}
      isRequired={true}
    />

    <KuInput
      name="confirmPassword"
      dataType="password"
      label="Confirmar Nova Senha"
      placeholder="••••••••"
      bind:value={confirmPassword}
      isRequired={true}
    />

    <div class="flex items-center justify-end space-x-3 pt-4">
      <Button color="alternative" on:click={handleCancel} disabled={loading}>
        Cancelar
      </Button>
      <Button
        type="button"
        color="blue"
        on:click={handleSubmit}
        disabled={loading}
      >
        {loading ? "Processando..." : "Alterar Senha"}
      </Button>
    </div>
  </form>
</div>
