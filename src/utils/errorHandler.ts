import { get } from 'svelte/store';
import { locale, t } from 'svelte-i18n';

export function handleApiError(error: any): string {
	const currentLocale = get(locale) || 'pt'; // Use 'pt' as a default locale

	// Aqui você pode mapear erros específicos de sua API para mensagens de erro humanizadas
	if (error.message.match(/login/i))
		return get(t)('errors.login_failed', { locale: currentLocale });
	if (error.message.match('signup'))
		return get(t)('errors.signup_failed', { locale: currentLocale });

	return error.message;
}
