export interface IModulePermission {
	moduleId: string;
	permissionActions: string[];
}

export interface IPermission {
	_id: string;
	name: string;
	description: string;
	isAdminPermission: boolean;
	modulePermissions: IModulePermission[];
}

export async function fetchPermissions(): Promise<IPermission[]> {
	const response = await fetch(`http://localhost:3000/v1/permissions`, {
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
		name: el['name'],
		description: el['description'],
		isAdminPermission: el['isAdminPermission'],
		modulePermissions: el['modulePermissions']
	}));
}

export async function fetchPermission(id: string): Promise<IPermission> {
	const response = await fetch(`http://localhost:3000/v1/permissions/${id}`, {
		method: 'GET',
		headers: {
			Authorization: localStorage.getItem('authToken')!,
			'Content-Type': 'application/json',
			Accept: 'application/json'
		}
	});

	if (!response.ok) throw new Error('Permission not found');

	const jsonResponse = await response.json();

	return {
		_id: jsonResponse['_id'],
		name: jsonResponse['name'],
		description: jsonResponse['description'],
		isAdminPermission: jsonResponse['isAdminPermission'],
		modulePermissions: jsonResponse['modulePermissions']
	};
}

export async function createPermission(permission: Partial<IPermission>): Promise<void> {
	const response = await fetch(`http://localhost:3000/v1/permissions`, {
		method: 'POST',
		headers: {
			Authorization: localStorage.getItem('authToken')!,
			'Content-Type': 'application/json',
			Accept: 'application/json'
		},
		body: JSON.stringify(permission)
	});

	if (!response.ok) throw new Error('Permission not created');
}

export async function updatePermission(permission: Partial<IPermission>): Promise<void> {
	const id = permission._id;
	delete permission._id;
	const response = await fetch(`http://localhost:3000/v1/permissions/${id}`, {
		method: 'PATCH',
		headers: {
			Authorization: localStorage.getItem('authToken')!,
			'Content-Type': 'application/json',
			Accept: 'application/json'
		},
		body: JSON.stringify(permission)
	});

	if (!response.ok) throw new Error('Permission not updated');
}

export async function deletePermission(permissionId: string): Promise<boolean> {
	const response = await fetch(`http://localhost:3000/v1/permissions/${permissionId}`, {
		method: 'DELETE',
		headers: {
			Authorization: localStorage.getItem('authToken')!,
			'Content-Type': 'application/json',
			Accept: 'application/json'
		}
	});

	return response.ok;
}
