import fetchAPI from "../fetchAPI";

export default async function getAllTokens() {
    const { data } = await fetchAPI.get('/tokens/getAll')
    return data;
}
