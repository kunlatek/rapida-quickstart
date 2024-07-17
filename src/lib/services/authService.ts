import { goto } from '$app/navigation';
import type { ILoginResponse, ISignupResponse } from '../../types/auth';

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
	localStorage.setItem('userIdLogged', 'true');
}

export async function signup(email: string, password: string): Promise<void> {
	const response = await fetch('http://localhost:3000/v1/auth/signup', {
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
	const response = await fetch('http://localhost:3000/v1/auth/logout', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json'
		}
	});

	if (!response.ok) {
		throw new Error('Logout failed');
	}

	localStorage.removeItem('userIdLogged');
	goto('/');
}
