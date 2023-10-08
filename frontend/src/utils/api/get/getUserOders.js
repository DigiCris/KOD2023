import fetchAPI from '../fetchAPI';

// All the orders of the user
export default async function getUserOrders(trading_pair) {
    const { data } = await fetchAPI.get('/orders/getUserOrders', {
        data: {
            method: 'getUserOrders',
            trading_pair,
        },
    });
    return data;
}
