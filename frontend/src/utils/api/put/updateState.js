import fetchAPI from '../fetchAPI';

export default async function updateState(txHash, state) {
    const { data } = await fetchAPI.post('/movements/updateState', {
        method: 'updateState',
        description: txHash,
        state,
    });
    return data;
}
