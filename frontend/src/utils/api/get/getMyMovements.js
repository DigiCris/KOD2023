import fetchAPI from "../fetchAPI";

export default async function getMyMovements() {
	const { data } = await fetchAPI.get('/movements/getByUserId')
	return data;
}
