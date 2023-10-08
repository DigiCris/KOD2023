import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import getMovements from './utils/api/get/getMyMovements';
import getRpcUrl from './utils/api/get/getRpcUrl';
import updateState from './utils/api/put/updateState';
import { getTransactionStatusByHash } from './utils/functions/web3Fns';
import Exchange from './views/Exchange';

export default function App() {
    // --- Variables --- //

    /**
     * @title Movements for analize state.
     * @typedef {Array} movements
     * @description This is an array that stores the movements to be able to analyze
     * if any of them are in pending status to later review them in the smart contracts
     * and if they are not in pending status in the smart contracts, modify them in the database.
     */
    /**
     * @title Second element of the array returned by a hook.
     * @typedef {Function} setMovements
     * @description This is function that set the value of movements array.
     */
    /**
     * @title Hook that saves the movements.
     * @type {[movements, setMovements]}
     * @description useState hook that saves the data of movements.
     */
    const [movements, setMovements] = useState([]);

    /**
     * @title Boolean that indicates whether the array of movements was analyzed.
     * @typedef {Boolean} stateUpdated
     * @description This is a boolean who.
     */
    /**
     * @title Setter of stateUpdated boolean,
     * @typedef {Function} setStateUpdated
     * @description This is function that set the value of stateUpdated boolean,
     */
    /**
     * @title Hook that saves a boolean.
     * @type {[stateUpdated, setStateUpdated]}
     * @description useState hook that saves if the movements have been analized.
     */
    const [stateUpdated, setStateUpdated] = useState(true);

    // --- Functions --- //

    /**
     * @title Function who set the rpc.
     * @typedef {Function} handlingRpcUrl
     * @description Function who set the rpc on the Local Storage for the web3 usage.
     */
    const handlingRpcUrl = async () => {
        const rpc = localStorage.getItem('rpc');
        if (!rpc.includes('https://')) {
            const res = await getRpcUrl();
            localStorage.setItem('rpc', res[0].url);
        }
    };

    /**
     * @title Function who get the movements.
     * @typedef {Function} handleMovements
     * @description Function that obtains the movements of the db by means of a promise.
     */
    const handleMovements = async () => {
        const { response } = await getMovements();
        setMovements(response);
    };

    /**
     * @title Function who verify the last movement pending.
     * @typedef {Function} verifyingLastPending
     * @description Function that cycles between transactions to ensure that none are left
     * with pending status in the database.
     */
    const verifyingLastPending = async (interval) => {
        setStateUpdated(false);
        const pendingList = movements
            ?.reverse()
            ?.filter((e) => e.state === 'pending' && e.description !== '');
        if (pendingList.length === 0) clearInterval(interval);
        for (let i = 0; i < pendingList.length; i++) {
            const { description: txHash } = pendingList[i];
            const status = await getTransactionStatusByHash(txHash);
            if (status != '185') {
                await updateState(txHash, status).then((res) => {
                    setStateUpdated(true);
                });
                break;
            }
        }
    };

    useEffect(() => {
        handlingRpcUrl();
        handleMovements();
    }, []);

    useEffect(() => {
        if (movements?.length === 0) return;
        const interval = setInterval(() => {
            if (stateUpdated && movements?.length > 0)
                verifyingLastPending(interval);
        }, 60000);
        return () => clearInterval(interval);
    }, [movements]);

    return (
        <>
            <Layout>
                <Routes>
                    <Route path="/exchange" element={<Exchange />} />
                </Routes>
            </Layout>
        </>
    );
}
