import fetchAPI from '../fetchAPI';

export default async function setOrder(
    order_type,
    trading_pair,
    order_price,
    order_quantity
) {
    /* 
        trading_pair => USDC/USDT
        order_price => User pay for the order quantity if order_type==='buy'
        order_quantity => User 
     */
    const { data } = await fetchAPI.post('/orders/setOrder', {
        method: 'setOrder',
        order_type,
        trading_pair,
        order_price,
        order_quantity,
    });
    return data;
}
