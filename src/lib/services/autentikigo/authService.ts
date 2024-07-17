import { goto } from '$app/navigation';
import type { ILoginResponse, ISignupResponse } from '../../../types/auth';

export async function login(email: string, password: string): Promise<void> {
	const response = await fetch('http://localhost:3000/v1/auth/login', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json'
		},
		body: JSON.stringify({ email, password })
	});

	if (!response.ok) {
		throw new Error('Login failed');
	}

	const jsonResponse: ILoginResponse = await response.json();
	localStorage.setItem('authToken', `Bearer ${jsonResponse.token}`);
}

export async function signup(email: string, password: string): Promise<void> {
	const response = await fetch('http://localhost:3000/v1/auth/register', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json'
		},
		body: JSON.stringify({ email, password })
	});

	if (!response.ok) {
		throw new Error('Signup failed');
	}
}

export async function logout(): Promise<void> {
	localStorage.removeItem('authToken');
	goto('/');
}
