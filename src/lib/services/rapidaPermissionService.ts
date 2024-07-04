export interface IRapidaPermission {
	_id: string;
	name: string;
	description: string;
	isAdminPermission: boolean;
	modulePermissions: any[];
}

export async function fetchPermissions(): Promise<IRapidaPermission[]> {
	const response = await fetch(`http://localhost:3000/v1/permissions`, {
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
		name: el['name'],
		description: el['description'],
		isAdminPermission: el['isAdminPermission'],
		modulePermissions: el['modulePermissions']
	}));
}
