<script>
    import { onMount } from "svelte";
    import { authService } from "$services/auth";
    import { goto } from "$app/navigation";
    import { toastStore } from "$stores/toast";
    import { Button } from "flowbite-svelte";
    import { browser } from "$app/environment";

    export let loading = false;

    // Variável para armazenar o client_id obtido do backend
    let appleClientId = "";

    // Função para obter o client_id da Apple
    async function getAppleClientId() {
        try {
            // Em ambiente de produção, você pode ter um endpoint para obter essas configurações
            // ou usar variáveis de ambiente expostas pelo Vite
            if (
                import.meta &&
                import.meta.env &&
                import.meta.env.VITE_APPLE_CLIENT_ID
            ) {
                return import.meta.env.VITE_APPLE_CLIENT_ID;
            }

            // Alternativa: obter do backend
            // const response = await fetch('/api/config/apple-client-id');
            // const data = await response.json();
            // return data.clientId;

            // Fallback para desenvolvimento (não recomendado para produção)
            return (
                import.meta.env.VITE_APPLE_CLIENT_ID || "your-apple-client-id"
            );
        } catch (error) {
            console.error("Erro ao obter Apple Client ID:", error);
            return null;
        }
    }

    async function handleAppleLogin() {
        try {
            loading = true;
            console.log("🔄 Iniciando processo de login com Apple");

            // Verificar se o script da Apple já foi carregado
            if (!window.AppleID) {
                await loadAppleScript();
            }

            // Obter o client_id se ainda não tivermos
            if (!appleClientId) {
                appleClientId = await getAppleClientId();
                if (!appleClientId) {
                    throw new Error("Não foi possível obter o Apple Client ID");
                }
            }

            // Inicializar o cliente da Apple
            window.AppleID.auth.init({
                clientId: appleClientId,
                scope: "email name",
                redirectURI: window.location.origin,
                usePopup: true,
            });

            // Solicitar o login
            const response = await window.AppleID.auth.signIn();
            console.log("🔑 Token da Apple obtido");

            // Processar resposta do Apple Sign In
            if (
                response &&
                response.authorization &&
                response.authorization.id_token
            ) {
                const result = await authService.appleLogin(
                    response.authorization.id_token,
                );

                toastStore.success("Login com Apple realizado com sucesso!");

                // Verificar se precisa selecionar perfil
                const roleStatus = await authService.checkAndSetActiveRole();

                if (roleStatus.needsSelection) {
                    goto("/profile/role-select");
                } else if (!roleStatus.hasRole) {
                    goto("/profile/select");
                } else {
                    goto("/dashboard");
                }
            } else {
                throw new Error("Token não recebido da Apple");
            }
        } catch (error) {
            console.error("❌ Erro no login com Apple:", error);
            toastStore.error(
                error.response?.data?.message ||
                    "Erro ao fazer login com Apple. Tente novamente.",
            );
        } finally {
            loading = false;
        }
    }

    // Função para carregar o script da Apple
    function loadAppleScript() {
        return new Promise((resolve, reject) => {
            if (window.AppleID) {
                resolve();
                return;
            }

            const script = document.createElement("script");
            script.src =
                "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js";
            script.async = true;
            script.defer = true;
            script.onload = resolve;
            script.onerror = () =>
                reject(new Error("Falha ao carregar o script da Apple"));
            document.head.appendChild(script);
        });
    }

    onMount(async () => {
        if (browser) {
            try {
                await loadAppleScript();
                appleClientId = await getAppleClientId();
            } catch (error) {
                console.error("❌ Erro ao inicializar Apple Sign-In:", error);
            }
        }
    });
</script>

<Button
    color="alternative"
    on:click={handleAppleLogin}
    disabled={loading}
    class="flex items-center justify-center w-full"
>
    <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24">
        <path
            fill="currentColor"
            d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.09,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z"
        ></path>
    </svg>
    {loading ? "Aguarde..." : "Continuar com Apple"}
</Button>
