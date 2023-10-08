import fetchAPI from '../fetchAPI';

export default async function getRpcUrl() {
    const { data } = await fetchAPI('/web3/getRpcUrl.json');
    return data;
}
