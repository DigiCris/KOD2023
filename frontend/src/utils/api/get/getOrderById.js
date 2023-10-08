import fetchAPI from '../fetchAPI';

export default async function getOrderById(order_id) {
    const { data } = await fetchAPI.get('/orders/getOrderById', {
        data: {
            method: 'getOrderById',
            order_id,
        },
    });
    return data;
}
