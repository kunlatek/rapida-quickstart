<script>
  import { goto } from "$app/navigation";
  import { authStore } from "$stores/auth";
  import { toastStore } from "$stores/toast";
  import { authService } from "$services/auth";
  import { profileService } from "$services/profile";
  import PersonProfileForm from "$components/pages/profile/PersonProfileForm.svelte";
  import { onMount } from "svelte";
    import Loading from "../../../../lib/components/common/Loading.svelte";

  let loading = false;
  let errors = {};
  let success = "";
  let checkingProfile = true;

  onMount(async () => {
    if (!$authStore.isAuthenticated) {
      toastStore.error("Você precisa estar logado para acessar esta página");
      goto("/auth/login");
      return;
    }

    try {
      const profiles = await profileService.checkUserProfiles(
        $authStore.user.userId
      );

      if (profiles.hasPerson) {
        toastStore.warning("Você já possui um perfil de pessoa.");
        goto(`/profile/person/${profiles.personId}`);
        return;
      }
    } catch (error) {
      console.error("Erro ao verificar perfil:", error);
    } finally {
      checkingProfile = false;
    }
  });

  async function handleSubmit(event) {
    const profileData = event.detail;

    // Adicionar userId ao perfil
    profileData.userId = $authStore.user.userId;

    try {
      loading = true;
      errors = {};

      // Criar o perfil - armazenar a resposta completa
      const response = await profileService.createPersonProfile(profileData);
      console.log("Resposta da criação de perfil:", response);

      success = "Perfil criado com sucesso!";
      toastStore.success("Perfil criado com sucesso!");

      // Verificar se a API retornou um token atualizado
      if (response && response.access_token) {
        console.log("Token recebido após criar perfil, atualizando sessão...");
        authService.setSession(response.access_token);

        // Forçar recarregamento da página para aplicar novos papéis
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1500);
      } else {
        // Se o backend não retornou o token, fazer uma chamada explícita para switch-role
        console.log("Token não recebido, tentando switch-role manualmente...");

        try {
          const switchSuccess = await authService.switchRole("person");
          if (switchSuccess) {
            // O método switchRole já vai recarregar a página
            toastStore.success("Perfil ativado com sucesso!");
          } else {
            // Se falhar, redirecionar mesmo assim para o dashboard após aviso
            toastStore.warning(
              "Perfil criado, mas não foi possível ativá-lo automaticamente."
            );
            setTimeout(() => {
              goto("/dashboard");
            }, 1500);
          }
        } catch (switchError) {
          console.error("Erro ao trocar papel após criar perfil:", switchError);
          toastStore.warning(
            "Perfil criado, mas houve um erro ao ativá-lo. Tente fazer login novamente."
          );

          // Mesmo com erro, redirecionar para dashboard
          setTimeout(() => {
            goto("/dashboard");
          }, 1500);
        }
      }
    } catch (error) {
      console.error("Erro ao criar perfil:", error);

      if (error.response?.data?.message) {
        toastStore.error(error.response.data.message);
      } else {
        toastStore.error("Erro ao criar perfil. Tente novamente.");
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
  <title>Criar Perfil de Pessoa - Rapida Quickstart</title>
</svelte:head>

{#if checkingProfile}
  <div class="flex justify-center items-center py-12">
    <Loading />
  </div>
{:else}
  <div class="max-w-4xl mx-auto pb-20">
    <div class="text-gray-500 dark:text-gray-400 mb-6 px-4">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Criar Perfil de Pessoa
      </h1>
      <div class="text-gray-500 dark:text-gray-400 mb-6">
        <p>
          Preencha o formulário abaixo para criar seu perfil de pessoa. Os
          campos marcados com <span class="text-red-500">*</span> são obrigatórios.
        </p>
      </div>

      <PersonProfileForm
        {loading}
        {errors}
        {success}
        on:submit={handleSubmit}
        on:cancel={handleCancel}
      />
    </div>
  </div>
{/if}
