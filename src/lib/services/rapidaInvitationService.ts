export interface IRapidaInvitation {
	_id: string;
	email: string;
	permission: string;
	accepted: boolean;
}

export async function fetchInvitations(term?: string): Promise<IRapidaInvitation[]> {
	const filter = term ? `?filter={'email':'${term}'}` : '';
	const response = await fetch(`http://localhost:3000/v1/invitations${filter}`, {
		method: 'GET',
		headers: {
			Authorization: sessionStorage.getItem('authToken')!,
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
