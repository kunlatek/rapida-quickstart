export interface IInvitation {
	_id: string;
	email: string;
	permission: string;
	accepted: boolean;
}

export async function fetchInvitations(term?: string): Promise<IInvitation[]> {
	const filter = term ? `?filter={'email':'${term}'}` : '';
	const response = await fetch(`http://localhost:3000/v1/invitations${filter}`, {
		method: 'GET',
		headers: {
			Authorization: localStorage.getItem('authToken')!,
			'Content-Type': 'application/json',
			Accept: 'application/json'
		}
	});

	if (!response.ok) return [];

	const jsonResponse = await response.json();

	return jsonResponse.result.map((el: any) => ({
		_id: el['_id'],
		email: el['email'],
		permission: el['permission'],
		accepted: el['accepted']
	}));
}

export async function fetchInvitation(id: string): Promise<IInvitation> {
	const response = await fetch(`http://localhost:3000/v1/invitations/${id}`, {
		method: 'GET',
		headers: {
			Authorization: localStorage.getItem('authToken')!,
			'Content-Type': 'application/json',
			Accept: 'application/json'
		}
	});

	if (!response.ok) throw new Error('Invitation not found');

	const jsonResponse = await response.json();

	return {
		_id: jsonResponse['_id'],
		email: jsonResponse['email'],
		permission: jsonResponse['permission'],
		accepted: jsonResponse['accepted']
	};
}

export async function createInvitation(invitation: Partial<IInvitation>): Promise<void> {
	const response = await fetch(`http://localhost:3000/v1/invitations`, {
		method: 'POST',
		headers: {
			Authorization: localStorage.getItem('authToken')!,
			'Content-Type': 'application/json',
			Accept: 'application/json'
		},
		body: JSON.stringify(invitation)
	});

	if (!response.ok) throw new Error('Invitation not created');
}

export async function updateInvitation(invitation: Partial<IInvitation>): Promise<void> {
	const id = invitation._id;
	delete invitation._id;
	const response = await fetch(`http://localhost:3000/v1/invitations/${id}`, {
		method: 'PATCH',
		headers: {
			Authorization: localStorage.getItem('authToken')!,
			'Content-Type': 'application/json',
			Accept: 'application/json'
		},
		body: JSON.stringify(invitation)
	});

	if (!response.ok) throw new Error('Invitation not updated');
}

export async function deleteInvitation(id: string): Promise<boolean> {
	const response = await fetch(`http://localhost:3000/v1/invitations/${id}`, {
		method: 'DELETE',
		headers: {
			Authorization: localStorage.getItem('authToken')!,
			'Content-Type': 'application/json',
			Accept: 'application/json'
		}
	});

	return response.ok;
}
