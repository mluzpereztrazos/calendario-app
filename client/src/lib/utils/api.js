
const URL_BASE = 'https://complete-crud-react-node-back.onrender.com';
const URL_API = '/api/users/';

export const getAllData = async () => {
	try {
		const response = await fetch(URL_BASE + URL_API);
		if (response.ok) {
			const data = await response.json();
			return data;
		} else {
			return [];
		}
	} catch (error) {
		console.log(error);
		throw new Error(error);
	}
};

export const getDataById = async id => {
	try {
		const response = await fetch(URL_BASE + URL_API + id);
		if (response.ok) {
			const data = await response.json();
			return data;
		} else {
			return [];
		}
	} catch (error) {
		console.log(error);
	}
};

export const updateDataById = async (id, body) => {
	try {
		const response = await fetch(URL_BASE + URL_API + id, {
			method: 'PATCH',
			body: JSON.stringify(body),
			headers: { 'Content-Type': 'application/json' }
		});
		const data = await response.json();
		return data;
	} catch (error) {
		console.log(error);
	}
};

export const deleteDataById = async id => {
	try {
		const response = await fetch(URL_BASE + URL_API + id, {
			method: 'DELETE'
		});
		const data = await response.json();
		return data;
	} catch (error) {
		console.log(error);
	}
};
