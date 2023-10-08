import fetchAPI from '../fetchAPI';

export default async function getAddress() {
    const { data } = await fetchAPI.get('/web3/address.json');
    return data;
}
