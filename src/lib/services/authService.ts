import type { ILoginResponse, ISignupResponse } from '../../types/auth';

export async function login(email: string, password: string): Promise<ILoginResponse> {
  const response = await fetch('http://localhost:3000/v1/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  return response.json();
}

export async function signup(email: string, password: string): Promise<ISignupResponse> {
  const response = await fetch('http://localhost:3000/v1/auth/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });

  if (!response.ok) {
    throw new Error('Signup failed');
  }

  return response.json();
}
