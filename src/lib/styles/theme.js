export const themeConfig = {
  colors: {
    primary: {
      50: "var(--primary-50)",
      100: "var(--primary-100)",
      200: "var(--primary-200)",
      300: "var(--primary-300)",
      400: "var(--primary-400)",
      500: "var(--primary-500)",
      600: "var(--primary-600)",
      700: "var(--primary-700)",
      800: "var(--primary-800)",
      900: "var(--primary-900)",
    },
    success: {
      50: "var(--success-50)",
      500: "var(--success-500)",
      600: "var(--success-600)",
    },
    error: {
      50: "var(--error-50)",
      500: "var(--error-500)",
      600: "var(--error-600)",
    },
    warning: {
      50: "var(--warning-50)",
      500: "var(--warning-500)",
      600: "var(--warning-600)",
    },
    info: {
      50: "var(--info-50)",
      500: "var(--info-500)",
      600: "var(--info-600)",
    },
  },

  components: {
    input: {
      variants: {
        default: {
          base: "bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white",
          error: "border-red-500 focus:border-red-500 focus:ring-red-500",
        },
        underlined: {
          base: "bg-transparent border-0 border-b-2 border-gray-300 text-gray-900 focus:ring-0 focus:border-primary-500 dark:bg-transparent dark:border-gray-600 dark:text-white",
          error: "border-red-500 focus:border-red-500",
        },
        filled: {
          base: "bg-gray-100 border-0 text-gray-900 rounded-lg focus:ring-primary-500 dark:bg-gray-800 dark:text-white",
          error: "bg-red-50 dark:bg-red-900/20 focus:ring-red-500",
        },
      },
    },
    select: {
      variants: {
        default: {
          base: "bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white",
          error: "border-red-500 focus:border-red-500 focus:ring-red-500",
        },
      },
    },
    button: {
      variants: {
        primary: {
          base: "text-white bg-primary-500 hover:bg-primary-600 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800",
        },
        secondary: {
          base: "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700",
        },
        success: {
          base: "text-white bg-success-500 hover:bg-success-600 focus:ring-4 focus:ring-success-300 dark:bg-success-600 dark:hover:bg-success-700 dark:focus:ring-success-800",
        },
        danger: {
          base: "text-white bg-error-500 hover:bg-error-600 focus:ring-4 focus:ring-error-300 dark:bg-error-600 dark:hover:bg-error-700 dark:focus:ring-error-800",
        },
        warning: {
          base: "text-white bg-warning-500 hover:bg-warning-600 focus:ring-4 focus:ring-warning-300 dark:bg-warning-600 dark:hover:bg-warning-700 dark:focus:ring-warning-800",
        },
      },
      sizes: {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2",
        lg: "px-5 py-2.5 text-lg",
      },
    },
    file: {
      variants: {
        default: {
          base: "block w-full text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white",
          error: "border-red-500 focus:border-red-500",
        },
      },
    },
    fieldset: {
      variants: {
        default: {
          base: "w-full bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 border border-gray-200 dark:border-gray-700",
        },
        card: {
          base: "w-full bg-white dark:bg-gray-800 rounded-lg p-6 mb-4 shadow-md border border-gray-100 dark:border-gray-700",
        },
      },
    },
    tab: {
      variants: {
        default: {
          base: "border-b border-gray-200 dark:border-gray-100 dark:text-gray-100",
          active:
            "text-blue-600 border-b border-blue-600 dark:text-gray-100 dark:border-gray-500 dark:bg-gray-700",
          inactive:
            "hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 border-b-2 border-transparent",
        },
        pills: {
          base: "flex flex-wrap space-x-2",
          active: "bg-blue-600 text-white rounded-full",
          inactive:
            "text-gray-500 hover:text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-full",
        },
      },
    },
    array: {
      variants: {
        default: {
          base: "w-full bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 border border-gray-200 dark:border-gray-700",
          item: "mb-4 p-3 border border-gray-200 dark:border-gray-700 rounded-lg",
        },
      },
    },
    autocomplete: {
      variants: {
        default: {
          base: "relative",
          input:
            "w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
          dropdown:
            "absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg dark:bg-gray-700",
          option:
            "w-full text-left cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100 dark:hover:bg-gray-600",
          error: "border-red-500 focus:border-red-500 focus:ring-red-500",
        },
      },
    },
    dataTable: {
      variants: {
        default: {
          base: "bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden",
          header: "bg-gray-50 dark:bg-gray-700",
          body: "divide-y divide-gray-200 dark:divide-gray-700",
        },
        bordered: {
          base: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden",
          header:
            "bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-700",
          body: "divide-y divide-gray-200 dark:divide-gray-700",
        },
        striped: {
          base: "bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden",
          header: "bg-gray-50 dark:bg-gray-700",
          body: "divide-y divide-gray-200 dark:divide-gray-700",
          row: "even:bg-gray-50 even:dark:bg-gray-700",
        },
      },
    },

    dataCard: {
      variants: {
        default: {
          base: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md overflow-hidden",
        },
        elevated: {
          base: "bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden",
        },
        flat: {
          base: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden",
        },
      },
    },
  },
};

// Helper para obter classes de componentes
export function getComponentClasses(
  component,
  variant = "default",
  state = {}
) {
  if (!themeConfig.components[component]) {
    console.warn(`Theme config for component '${component}' not found`);
    return "";
  }

  const variantConfig =
    themeConfig.components[component].variants[variant] ||
    themeConfig.components[component].variants.default;

  if (!variantConfig) {
    console.warn(`Variant '${variant}' for component '${component}' not found`);
    return "";
  }

  let classes = variantConfig.base || "";

  // Adicionar classes de estado
  if (state.error && variantConfig.error) {
    classes += ` ${variantConfig.error}`;
  }

  if (state.disabled) {
    classes += " opacity-70 cursor-not-allowed";
  }

  return classes;
}

// Helper para obter classes de tamanho de botão
export function getButtonSizeClasses(size = "md") {
  return (
    themeConfig.components.button.sizes[size] ||
    themeConfig.components.button.sizes.md
  );
}
