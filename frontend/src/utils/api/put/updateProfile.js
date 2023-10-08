import fetchAPI from '../fetchAPI';

export default async function updateProfile(body) {
    const { data } = await fetchAPI.post('/registers/updateUser', {
        method: 'updateUser',
        phone: body.phone,
        banco: body.banco,
        withdrawAddress: body.withdrawAddress
    });
    return data;
}
