import fetchAPI from '../fetchAPI';

export default async function getOpenOrders(trading_pair) {
    const { data } = await fetchAPI.get('/orders/getOpenOrders', {
        data: {
            method: 'getOpenOrders',
            trading_pair,
        },
    });
    return data;
}
