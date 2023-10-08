import fetchAPI from '../fetchAPI';

export default async function getAllOrders() {
    const { data } = await fetchAPI.get('/orders/getAllOrders', {
        data: {
            method: 'getAllOrders',
        },
    });
    return data;
}
