import fetchAPI from '../fetchAPI';

export default async function getDepositAddress() {
    const { data } = await fetchAPI.get('/registers/getDepositAddress');
    return data;
}
