import fetchAPI from '../fetchAPI';

// kycStatus: 0 - not verified, 1 - denied, 2 - pending, 3 - verified

export default async function updateKycStatus(kycStatus) {
    const { data } = await fetchAPI.post('/registers/updateKycStatus', {
        method: 'updateKycStatus',
        kycStatus: kycStatus
    });
}
