export interface IModule {
	_id: string;
	name: string;
	description?: string;
	route: string;
	icon: string;
}

export async function fetchModules(term?: string): Promise<IModule[]> {
	const filter = term ? `?filter={'name':'${term}'}` : '';
	const response = await fetch(`http://localhost:3000/v1/modules${filter}`, {
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
		route: el['route'],
		icon: el['icon']
	}));
}

export async function fetchModule(id: string): Promise<IModule> {
	const response = await fetch(`http://localhost:3000/v1/modules/${id}`, {
		method: 'GET',
		headers: {
			Authorization: localStorage.getItem('authToken')!,
			'Content-Type': 'application/json',
			Accept: 'application/json'
		}
	});

	if (!response.ok) throw new Error('Module not found');

	const jsonResponse = await response.json();

	return {
		_id: jsonResponse['_id'],
		name: jsonResponse['name'],
		description: jsonResponse['description'],
		route: jsonResponse['route'],
		icon: jsonResponse['icon']
	};
}

export async function createModule(module: Partial<IModule>): Promise<void> {
	const response = await fetch(`http://localhost:3000/v1/modules`, {
		method: 'POST',
		headers: {
			Authorization: localStorage.getItem('authToken')!,
			'Content-Type': 'application/json',
			Accept: 'application/json'
		},
		body: JSON.stringify(module)
	});

	if (!response.ok) throw new Error('Module not created');
}

export async function updateModule(module: Partial<IModule>): Promise<void> {
	const id = module._id;
	delete module._id;
	const response = await fetch(`http://localhost:3000/v1/modules/${id}`, {
		method: 'PATCH',
		headers: {
			Authorization: localStorage.getItem('authToken')!,
			'Content-Type': 'application/json',
			Accept: 'application/json'
		},
		body: JSON.stringify(module)
	});

	if (!response.ok) throw new Error('Module not updated');
}

export async function deleteModule(id: string): Promise<boolean> {
	const response = await fetch(`http://localhost:3000/v1/modules/${id}`, {
		method: 'DELETE',
		headers: {
			Authorization: localStorage.getItem('authToken')!,
			'Content-Type': 'application/json',
			Accept: 'application/json'
		}
	});

	return response.ok;
}
