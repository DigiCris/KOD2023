import fetchAPI from '../fetchAPI';

export default async function updateMovements(descriptions) {
    const { data } = await fetchAPI.post('/movements/updateMultiStates', {
        descriptions,
        method: 'updateMultiStates',
    });
    return data;
}
