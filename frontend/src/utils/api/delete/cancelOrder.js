import fetchAPI from '../fetchAPI';

export default async function cancelOrder(orderId) {
    const { data } = await fetchAPI.delete('/orders/cancelOrder', {
        data: {
            method: 'cancelOrder',
            orderId,
        },
    });
    return data;
}
