<script>
  import { writable } from "svelte/store";
  import { onMount } from "svelte";
  import "../../styles/theme.css";

  // Tema padrão (light ou dark)
  export let initialTheme = "light";

  // Store para gerenciar o tema
  export const theme = writable(initialTheme);

  // Toggle entre temas
  export const toggleTheme = () => {
    theme.update((current) => {
      const newTheme = current === "dark" ? "light" : "dark";

      // Aplicar ao documento
      if (newTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }

      // Salvar preferência
      if (typeof localStorage !== "undefined") {
        localStorage.setItem("theme", newTheme);
      }

      return newTheme;
    });
  };

  onMount(() => {
    // Verificar preferência salva no localStorage
    if (typeof localStorage !== "undefined" && localStorage.getItem("theme")) {
      const savedTheme = localStorage.getItem("theme");
      theme.set(savedTheme);

      if (savedTheme === "dark") {
        document.documentElement.classList.add("dark");
      }
    } else if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      // Ou usar preferência do sistema
      theme.set("dark");
      document.documentElement.classList.add("dark");
    }
  });
</script>

<slot />
