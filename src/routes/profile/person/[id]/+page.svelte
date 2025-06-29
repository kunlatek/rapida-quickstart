<script>
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { authStore } from "$lib/stores/auth";
  import { toastStore } from "$lib/stores/toast";
  import { profileService } from "$services/profile";
  import { Card, Heading, Spinner } from "flowbite-svelte";
  import PersonProfileForm from "$components/pages/profile/PersonProfileForm.svelte";
  import { onMount } from "svelte";
  import KuLoading from "../../../../lib/components/common/KuLoading.svelte";

  const profileId = $page.params.id;
  let profile = null;
  let loading = false;
  let loadingProfile = true;
  let errors = {};
  let success = "";

  onMount(async () => {
    if (!$authStore.isAuthenticated) {
      toastStore.error("Você precisa estar logado para acessar esta página");
      goto("/auth/login");
      return;
    }

    try {
      // Carregar perfil existente
      profile = await profileService.getPersonProfileById(profileId);

      // Formatar data de nascimento para input de data
      if (profile.birthday) {
        profile.birthday = new Date(profile.birthday)
          .toISOString()
          .split("T")[0];
      }

      // Formatar outras datas
      if (profile.rgIssuanceDate) {
        profile.rgIssuanceDate = new Date(profile.rgIssuanceDate)
          .toISOString()
          .split("T")[0];
      }
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
      toastStore.error("Erro ao carregar dados do perfil");
      goto("/dashboard");
    } finally {
      loadingProfile = false;
    }
  });

  async function handleSubmit(event) {
    const profileData = event.detail;

    try {
      loading = true;
      errors = {};

      await profileService.updatePersonProfile(profileId, profileData);
      success = "Perfil atualizado com sucesso!";
      toastStore.success("Perfil de pessoa atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);

      if (error.response?.data?.message) {
        toastStore.error(error.response.data.message);
      } else {
        toastStore.error("Erro ao atualizar perfil. Tente novamente.");
      }

      if (error.response?.data?.errors) {
        errors = error.response.data.errors;
      }
    } finally {
      loading = false;
    }
  }

  function handleCancel() {
    goto("/dashboard");
  }
</script>

<svelte:head>
  <title>Editar Perfil de Pessoa - Rapida Quickstart</title>
</svelte:head>

<div class="max-w-screen-2xl mx-auto pb-20">
  {#if loadingProfile}
    <KuLoading />
  {:else if profile}
    <div class="text-gray-500 dark:text-gray-400 mb-6 px-4">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Editar Perfil de Pessoa
      </h1>
      <p>
        Edite as informações do seu perfil de pessoa. Os campos marcados com <span
          class="text-red-500">*</span
        > são obrigatórios.
      </p>
    </div>

    <PersonProfileForm
      {profile}
      {loading}
      {errors}
      {success}
      on:submit={handleSubmit}
      on:cancel={handleCancel}
    />
  {:else}
    <div class="text-center py-12">
      <p class="text-gray-500 dark:text-gray-400">
        Perfil não encontrado ou você não tem permissão para editá-lo.
      </p>
    </div>
  {/if}
</div>
