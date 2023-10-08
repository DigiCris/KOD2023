import fetchAPI from '../fetchAPI';

//
export default async function getOrderBook(trading_pair) {
    const { data } = await fetchAPI.get('/orders/getOrderBook', {
        data: {
            method: 'getOrderBook',
            trading_pair,
        },
    });
    return data;
}
