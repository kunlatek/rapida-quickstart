<script>
    import { onMount } from "svelte";
    import { authService } from "$services/auth";
    import { goto } from "$app/navigation";
    import { toastStore } from "$stores/toast";
    import { Button } from "flowbite-svelte";
    import { browser } from "$app/environment";

    export let loading = false;

    // Variável para armazenar o client_id obtido do backend
    let googleClientId = "";

    // Função para obter o client_id do Google
    async function getGoogleClientId() {
        try {
            // Em ambiente de produção, você pode ter um endpoint para obter essas configurações
            // ou usar variáveis de ambiente expostas pelo Vite
            if (
                import.meta &&
                import.meta.env &&
                import.meta.env.VITE_GOOGLE_CLIENT_ID
            ) {
                return import.meta.env.VITE_GOOGLE_CLIENT_ID;
            }

            // Alternativa: obter do backend
            // const response = await fetch('/api/config/google-client-id');
            // const data = await response.json();
            // return data.clientId;

            // Fallback para desenvolvimento (não recomendado para produção)
            return "482551344477-9117veto0ldaccf1pslmc6p0v5sbr7cu.apps.googleusercontent.com";
        } catch (error) {
            console.error("Erro ao obter Google Client ID:", error);
            return null;
        }
    }

    async function handleGoogleLogin() {
        try {
            loading = true;
            console.log("🔄 Iniciando processo de login com Google");

            // Verificar se o script do Google já foi carregado
            if (!window.google || !window.google.accounts) {
                await loadGoogleScript();
            }

            // Obter o client_id se ainda não tivermos
            if (!googleClientId) {
                googleClientId = await getGoogleClientId();
                if (!googleClientId) {
                    throw new Error(
                        "Não foi possível obter o Google Client ID",
                    );
                }
            }

            // Inicializar o cliente OAuth do Google
            window.google.accounts.id.initialize({
                client_id: googleClientId,
                callback: handleCredentialResponse,
                auto_select: false,
            });

            // Solicitar o login (usando o prompt)
            window.google.accounts.id.prompt((notification) => {
                if (
                    notification.isNotDisplayed() ||
                    notification.isSkippedMoment()
                ) {
                    console.log(
                        "O prompt do Google não foi exibido:",
                        notification.getNotDisplayedReason() ||
                            notification.getSkippedReason(),
                    );
                    loading = false;
                    toastStore.warning(
                        "Não foi possível exibir o login do Google. Tente novamente.",
                    );
                } else {
                    console.log("Prompt do Google exibido");
                }
            });
        } catch (error) {
            console.error("❌ Erro ao iniciar login com Google:", error);
            toastStore.error(
                "Não foi possível iniciar o login com Google. Tente novamente.",
            );
            loading = false;
        }
    }

    // Função para carregar o script do Google
    function loadGoogleScript() {
        return new Promise((resolve, reject) => {
            if (window.google && window.google.accounts) {
                resolve();
                return;
            }

            const script = document.createElement("script");
            script.src = "https://accounts.google.com/gsi/client";
            script.async = true;
            script.defer = true;
            script.onload = resolve;
            script.onerror = () =>
                reject(new Error("Falha ao carregar o script do Google"));
            document.head.appendChild(script);
        });
    }

    // Função para processar a resposta de credencial do Google
    async function handleCredentialResponse(response) {
        console.log("🔑 Token do Google obtido");
        try {
            if (!response.credential) {
                throw new Error("Token não recebido do Google");
            }

            // Usar o método existente em authService
            const result = await authService.googleLogin(response.credential);

            toastStore.success("Login com Google realizado com sucesso!");

            // Verificar se precisa selecionar perfil
            const roleStatus = await authService.checkAndSetActiveRole();

            if (roleStatus.needsSelection) {
                goto("/profile/role-select");
            } else if (!roleStatus.hasRole) {
                goto("/profile/select");
            } else {
                goto("/dashboard");
            }
        } catch (error) {
            console.error("❌ Erro no login com Google:", error);
            toastStore.error(
                error.response?.data?.message ||
                    "Erro ao fazer login com Google. Tente novamente.",
            );
        } finally {
            loading = false;
        }
    }

    onMount(async () => {
        if (browser) {
            // Carregar o script do Google quando o componente for montado
            try {
                await loadGoogleScript();
                googleClientId = await getGoogleClientId();
            } catch (error) {
                console.error("❌ Erro ao inicializar Google Sign-In:", error);
            }
        }
    });
</script>

<Button
    color="alternative"
    on:click={handleGoogleLogin}
    disabled={loading}
    class="flex items-center justify-center w-full"
>
    <svg
        class="w-5 h-5 mr-2"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
    >
        <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
            <path
                fill="#4285F4"
                d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
            />
            <path
                fill="#34A853"
                d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
            />
            <path
                fill="#FBBC05"
                d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
            />
            <path
                fill="#EA4335"
                d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
            />
        </g>
    </svg>
    {loading ? "Aguarde..." : "Continuar com Google"}
</Button>
