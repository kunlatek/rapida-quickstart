// /Users/opah/Code/personal/svelte-flowbite-permeson/src/lib/services/errorMapper.js

/**
 * @typedef {Object.<string, string>} ErrorMap
 * Mapeia códigos de erro do backend ou mensagens padrão do backend
 * para mensagens amigáveis a serem exibidas no frontend,
 * com base nas expectativas dos testes E2E e usabilidade.
 */

/** @type {ErrorMap} */
const backendToFrontendErrorMap = {
  // --- Mapeamentos diretos de ErrorCode (backend) para mensagens E2E (frontend) ---
  INVALID_CREDENTIALS: "Erro ao fazer login. Verifique suas credenciais.",
  "Invalid email or password.":
    "Erro ao fazer login. Verifique suas credenciais.", // Fallback se o código não vier
  EMAIL_IN_USE: "Este e-mail já está em uso. Tente outro.",
  "Email address is already in use.":
    "Este e-mail já está em uso. Tente outro.",

  // --- Outros mapeamentos com base nas definições do ErrorService do backend ---
  USER_NOT_FOUND: "Usuário não encontrado.",
  UNAUTHORIZED: "Você não tem autorização para realizar esta ação.",
  FORBIDDEN: "Você não tem permissão para realizar esta ação.",
  INVALID_DATE_RANGE: "Intervalo de datas inválido.",
  INVALID_EMAIL: "Endereço de e-mail inválido.",
  INVALID_PASSWORD: "A senha deve ter pelo menos 8 caracteres.", // Alinhado com o frontend
  INVALID_ZIP_CODE: "CEP inválido.",
  INVALID_PHONE_NUMBER: "Número de telefone inválido.",
  PROFILE_ALREADY_EXISTS: "Este usuário já possui um perfil.",
  PROFILE_NOT_FOUND: "Perfil não encontrado.",
  MINIMUM_AGE_REQUIRED: "É necessário ter 18 anos ou mais.",

  // Adicionar outros mapeamentos conforme necessário
};

const defaultFrontendError =
  "Ocorreu um erro inesperado. Por favor, tente novamente mais tarde.";

/**
 * @typedef {object} BackendErrorResponseData
 * @property {string} [errorCode]
 * @property {string} [message]
 */

/**
 * @typedef {object} AxiosErrorResponse
 * @property {{ data?: BackendErrorResponseData }} [response]
 */

/**
 * Traduz um erro do backend (código ou mensagem) para uma mensagem amigável no frontend.
 * @param {string | BackendErrorResponseData | (Error & AxiosErrorResponse)} backendError - O código do erro, a mensagem do backend, ou um objeto de erro da API.
 * @returns {string} A mensagem traduzida para o frontend.
 */
export function mapBackendErrorToFrontendMessage(backendError) {
  if (!backendError) {
    return defaultFrontendError;
  }

  let lookupKey = "";
  let potentialMessage = "";

  if (typeof backendError === "string") {
    lookupKey = backendError;
  } else if (typeof backendError === "object" && backendError !== null) {
    // Verificamos se é uma estrutura de erro do Axios
    if (
      "response" in backendError &&
      backendError.response &&
      typeof backendError.response === "object" &&
      backendError.response.data
    ) {
      const errorData = backendError.response.data;
      if (typeof errorData === "object" && errorData !== null) {
        if (errorData.errorCode) {
          lookupKey = errorData.errorCode;
        } else if (errorData.message) {
          lookupKey = errorData.message;
          potentialMessage = errorData.message; // Guardamos a mensagem original caso não haja errorCode
        }
      }
    }
    // Se não for um erro Axios, talvez seja diretamente o objeto com errorCode/message
    else {
      const directErrorData = backendError;
      if ("errorCode" in directErrorData && directErrorData.errorCode) {
        lookupKey = directErrorData.errorCode;
      } else if ("message" in directErrorData && directErrorData.message) {
        lookupKey = directErrorData.message;
        potentialMessage = directErrorData.message;
      }
    }
  }

  if (lookupKey && backendToFrontendErrorMap[lookupKey]) {
    return backendToFrontendErrorMap[lookupKey];
  }

  return defaultFrontendError;
}
