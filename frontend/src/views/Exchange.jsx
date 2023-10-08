import {
    ArrowDownIcon,
    ArrowForwardIcon,
    ArrowUpIcon,
    DeleteIcon,
} from '@chakra-ui/icons';
import {
    Box,
    Button,
    IconButton,
    Input,
    InputGroup,
    InputLeftElement,
    InputRightElement,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Select,
    Text,
    useDisclosure,
    useMediaQuery,
    useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import cancelOrder from '../utils/api/delete/cancelOrder';
import getOpenOrders from '../utils/api/get/getOpenOrders';
import getUserOrders from '../utils/api/get/getUserOders';
import setOrder from '../utils/api/post/setOrder';

const navigationButtons = [
    //{ text: 'Gráfico', tag: 'chart' },
    { text: 'Órdenes existentes', tag: 'orders' },
    { text: 'Mis órdenes', tag: 'my_orders' },
    { text: 'Historial', tag: 'history' },
];

const allTokenAvailables = ['USXD'];

export default function Exchange() {
    // --- Variables --- //

    /**
     * @title Boolean used to know when the modal is open.
     * @typedef {Boolean} isOpen
     * @description Variable containing a boolean to open or close the modal.
     */
    /**
     * @title Setter of isOpen.
     * @typedef {Function} onOpen
     * @description This is a function that changes the content of isOpen to true.
     */
    /**
     * @title Setter of isOpen.
     * @typedef {Function} onClose
     * @description This is a function that changes the content of isOpen to false.
     */
    const { isOpen, onOpen, onClose } = useDisclosure();

    /**
     * @title Boolean used for design.
     * @typedef {Boolean} isLargerThan800
     * @description useState which stores a Boolean that marks the gap between
     * desktop and mobile view.
     */
    const [isLargerThan800] = useMediaQuery('(min-width: 800px)');

    /**
     * @title Function used to notify.
     * @typedef {Boolean} toast
     * @description This function is used to create a toast that notifies the user if a certain function
     * has been executed correctly or if it has not been executed correctly.
     */
    const toast = useToast();

    /**
     * @title Boolean used to know when is loading.
     * @typedef {Boolean} loading
     * @description useState which stores a Boolean used to know when data arrives from the backend.
     */
    /**
     * @title Setter of loading.
     * @typedef {Function} setLoading
     * @description This is a function that changes the content of loading.
     */
    /**
     * @title Hook that stores offers.
     * @type {[loading, setLoading]}
     * @description useState which stores a boolean that determines whether the page is loading or not.
     */
    const [loading, setLoading] = useState(true);

    /**
     * @title Object used to store the modal data.
     * @typedef {Object} modalData
     * @description useState that stores an Object that has the content to render.
     */
    /**
     * @title Setter of modalData.
     * @typedef {Function} setModalData
     * @description This is a function that changes the content of modalData.
     */
    /**
     * @title Hook storing data for the modal.
     * @type {[modalData, setModalData]}
     * @description useState that stores an Object that has the content to render.
     */
    const [modalData, setModalData] = useState({});

    /**
     * @title Object that store the different tokens.
     * @typedef {Object} availableOffers
     * @description Object that store the different tokens with their available offers.
     */
    /**
     * @title Setter of availableOffers.
     * @typedef {Function} setAvailableOffers
     * @description This is a function that changes the content of availableOffers.
     */
    /**
     * @title Hook that stores offers.
     * @type {[availableOffers, setAvailableOffers]}
     * @description useState that stores offers made by users for p2p exchanges.
     */
    const [availableOffers, setAvailableOffers] = useState({
        USDT: [
            {
                order_id: 1,
                order_type: 'buy',
                trading_pair: 'BTC/USDT',
                order_price: 40000.0,
                order_quantity: 0.1,
                order_status: 'open',
                creation_datetime: '2023-09-25 18:47:00',
                user_id: 1,
                executed_quantity: 0.0,
                address: '0x21sad029378as19723das198a',
                signature: '',
            },
        ],
        USDC: [],
        BMT: [],
        SWF: [],
        BTK: [],
    });

    /**
     * @title Object that store the different tokens.
     * @typedef {Object} myOrders
     * @description Object that store the different tokens with the user offers.
     */
    /**
     * @title Setter of myOrders.
     * @typedef {Function} setMyOrders
     * @description This is a function that changes the content of myOrders.
     */
    /**
     * @title Hook that stores user offers.
     * @type {[myOrders, setMyOrders]}
     * @description useState that stores offers made by logued user for p2p exchanges.
     */
    const [myOrders, setMyOrders] = useState([
        {
            order_id: '1',
            order_type: 'buy',
            order_quantity: 21,
            order_price: 34,
            trading_pair: 'USDC/BMT',
        },
    ]);

    /**
     * @title Object that store the different orders executed.
     * @typedef {Object} history
     * @description Object that stores the different commands that were executed for the user.
     */
    /**
     * @title Setter of history.
     * @typedef {Function} setHistory
     * @description This is a function that changes the content of history.
     */
    /**
     * @title Hook that stores user history.
     * @type {[history, setHistory]}
     * @description useState that stores orders executed by logued user for p2p exchanges.
     */
    const [history, setHistory] = useState([
        {
            order_id: 1,
            order_type: 'buy',
            trading_pair: 'BTC/USDT',
            order_price: 40000.0,
            order_quantity: 0.1,
            order_status: 'open',
            creation_datetime: '2023-09-25 18:47:00',
            user_id: 1,
            executed_quantity: 0.0,
            address: '0x21sad029378as19723das198a',
            signature: '',
        },
    ]);

    /**
     * @title String storing the type of rendered section.
     * @typedef {String} buttonSelected
     * @description String indicating which section is being rendered.
     */
    /**
     * @title Setter of buttonSelected.
     * @typedef {Function} setButtonSelected
     * @description This is a function that changes the content of buttonSelected.
     */
    /**
     * @title Hook that store a string.
     * @type {[buttonSelected, setButtonSelected]}
     * @description useState that stores a string for button group design and section rendering.
     */
    const [buttonSelected, setButtonSelected] = useState('orders');

    /**
     * @title String storing the type of token to exchange.
     * @typedef {String} tokenOfInterest
     * @description String that indicates which token we are going to send if we are in the sale section
     * or we are going to receive if we are in the purchase section.
     */
    /**
     * @title Setter of tokenOfInterest.
     * @typedef {Function} setTokenOfInterest
     * @description This is a function that changes the content of tokenOfInterest.
     */
    /**
     * @title Hook that store a string.
     * @type {[tokenOfInterest, setTokenOfInterest]}
     * @description useState that stores a string for button to select token to exchange.
     */
    const [tokenOfInterest, setTokenOfInterest] = useState({
        name: 'BMT',
        tokenAddress: '',
    });

    const [tokenToExchange, setTokenToExchange] = useState({
        name: 'USXD',
        totalQuantity: 30,
        tokenAddress: '',
    });

    // --- Functions --- //

    const handleDeleteOrder = async () => {
        //const response = await cancelOrder(modalData.order_id);
        onClose();
        const { order_id } = modalData;
        const { success } = await cancelOrder(order_id);
        if (success) {
            toast({
                status: 'success',
                isClosable: true,
                title: 'Tu orden fue eliminada corectamente.',
                duration: 5000,
            });
        } else {
            toast({
                status: 'error',
                isClosable: true,
                title: 'Ocurrió un error eliminando tu orden, intenta de nuevo!',
                duration: 5000,
            });
        }
    };

    const [orderToSend, setOrderToSend] = useState({
        order_price: 0,
        order_quantity: 0,
        trading_pair: 'BMT/USXD',
    });

    function change(
        signatureBuy,
        amountBuy,
        priceBuy,
        signatureSell,
        amountSell,
        priceSell
    ) {
        alert(
            signatureBuy,
            amountBuy,
            priceBuy,
            signatureSell,
            amountSell,
            priceSell
        );
    }

    const crossAnalysis = async (myOffer) => {
        const sellOffers = availableOffers.BMT.filter(
            (item) => item.order_type === 'sell'
        );
        const purchaseOffers = availableOffers.BMT.filter(
            (item) => item.order_type === 'buy'
        );
        const index = sellOffers.findIndex((item) => {
            if (parseFloat(myOffer.order_price) >= parseFloat(item.order_price))
                return item;
        });
        if (index >= 0) {
            const { order_price, order_quantity, signature } = myOffer;
            change(
                signature,
                order_quantity,
                order_price,
                sellOffers[index].signature,
                sellOffers[index].order_quantity,
                sellOffers[index].order_price
            );
            sellOffers.splice(index, 1);
            setAvailableOffers({
                ...availableOffers,
                BMT: [...sellOffers, ...purchaseOffers],
            });
            localStorage.setItem(
                'starting_orders',
                JSON.stringify([...sellOffers, ...purchaseOffers])
            );
        } else return true;
    };

    function balanceUSDX() {
        return 30;
    }
    function balanceBMT() {}

    function createSignature() {
        return '0x44';
    }

    const handleSettingOrder = async () => {
        const { order_price, order_quantity } = orderToSend;
        if (order_price === 0 || order_price > tokenToExchange.totalQuantity)
            return toast({
                title: 'Verifique el monto ingresado',
                duration: 5000,
                isClosable: true,
                status: 'error',
            });
        if (order_quantity === 0)
            return toast({
                title: 'El precio límite debe ser mayor a 0',
                duration: 5000,
                isClosable: true,
                status: 'error',
            });
        const signature = createSignature();
        const body = {
            order_type: 'buy',
            trading_pair: orderToSend.trading_pair,
            order_price: orderToSend.order_price,
            order_quantity: orderToSend.order_quantity,
            signature,
            address: '0x31Dd1bD16B1D891bF9A3a60f1d319551D4Efccd8',
        };
        const keepGoing = crossAnalysis(body);
        if (keepGoing) {
            const res = await setOrder(body);
            setAvailableOffers({ ...availableOffers, BMT: res });
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            const usdxQuantity = balanceUSDX();
            setTokenToExchange({
                ...tokenToExchange,
                totalQuantity: usdxQuantity,
            });
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    /**
     * @title The fetch function is the one that is executed when the page is loaded.
     * @typedef {Function} fetch
     * @description In this case, it brings the offers available for a promise they make to the database.
     */
    const fetch = async () => {
        localStorage.setItem(
            'starting_orders',
            JSON.stringify([
                {
                    user_id: 24,
                    address: '0x3421DeE886aaa5993CCF58538982C60Bcf4051bf',
                    order_status: 'open',
                    creation_datetime: '2023-09-25 18:47:00',
                    order_id: '1',
                    order_type: 'sell',
                    trading_pair: 'BMT/USXD',
                    order_price: 0.9,
                    order_quantity: 10,
                    signature:
                        '0x2232082d23955ae8cedf5bccf6b6fb86947a201360ba8d322e7bae2f47c8c9042c4928c34594875fe0b33ed53a0e93dd6d69895ea97b19326972d20c1142e7cb1b',
                },
                {
                    user_id: 24,
                    address: '0x3421DeE886aaa5993CCF58538982C60Bcf4051bf',
                    order_status: 'open',
                    creation_datetime: '2023-09-25 18:47:00',
                    order_id: '2',
                    order_type: 'sell',
                    trading_pair: 'BMT/USXD',
                    order_price: 1,
                    order_quantity: 10,
                    signature:
                        '0xfd2e878e36dbb590d97ae703413c1c85677ea7ec879c632b61338921ab5ba6553fc65251a56dcebb4fec82ea6b630541018674938e33493ba72e18f075d554781c',
                },
                {
                    user_id: 24,
                    address: '0x3421DeE886aaa5993CCF58538982C60Bcf4051bf',
                    order_status: 'open',
                    creation_datetime: '2023-09-25 18:47:00',
                    order_id: '3',
                    order_type: 'sell',
                    trading_pair: 'BMT/USXD',
                    order_price: 1.1,
                    order_quantity: 10,
                    signature:
                        '0x920e3fe993808e611cddf5927add6d60f3b26244fa14034dd18445b920760a8c301aae00163f11063845db181183aef02eddbfb33427dad40c0f63d5dd4ebd6c1b',
                },
            ])
        );

        const { response: ordersToAvailableOffers } = await getOpenOrders(null);
        setAvailableOffers({
            ...availableOffers,
            BMT: JSON.parse(ordersToAvailableOffers),
        });

        // const { response: ordersOfUser } = await getUserOrders(null);
        // const ordersToMyOrders = ordersOfUser.filter(
        //     (item) => item.order_status === 'open'
        // );
        // const ordersToHistory = ordersOfUser.filter(
        //     (item) => item.order_status === 'filled'
        // );
        // setHistory(ordersToHistory);
        // setMyOrders(ordersToMyOrders);

        // const container = Object.assign(
        //     { ...availableOffers },
        //     {
        //         ...res.response,
        //     }
        // );
        // setAvailableOffers(container);
        setLoading(false);
    };

    useEffect(() => {
        fetch();
    }, []);

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Eliminar orden {modalData.id}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        Estás seguro que deseas eliminar esta orden
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            background={
                                'linear-gradient(253.62deg, rgb(14, 23, 25) 5.9%, rgb(40, 59, 63) 50.27%, rgb(38, 39, 39) 96.9%)'
                            }
                            color={'#f6f6f6'}
                            _hover={{
                                filter: 'contrast(120%)',
                            }}
                            mr={3}
                            onClick={handleDeleteOrder}
                        >
                            Eliminar
                        </Button>
                        <Button mr={3} onClick={onClose}>
                            Cancelar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Box
                style={{
                    width: isLargerThan800 ? '80%' : '-webkit-fill-available',
                    minHeight: isLargerThan800 ? 'calc(100vh - 50px)' : '',
                    height: !isLargerThan800 ? 'calc(100vh - 50px)' : '',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '10px 10px',
                    backgroundColor: '#e9e8e8',
                    marginTop: '50px',
                }}
            >
                <Box
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        height: '100%',
                        width: '100%',
                    }}
                >
                    <Box
                        id="navigationContainer"
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                        }}
                    >
                        <Box
                            id="navigationButtons"
                            style={{
                                display: 'flex',
                                gap: '10px',
                                background:
                                    'linear-gradient(253.62deg, rgb(14, 23, 25) 5.9%, rgb(40, 59, 63) 50.27%, rgb(38, 39, 39) 96.9%)',
                                padding: '5px',
                                borderRadius: '6px',
                                overflowX: 'auto',
                            }}
                        >
                            {navigationButtons.map((item) => (
                                <Button
                                    minWidth={'auto'}
                                    background={
                                        buttonSelected === item.tag
                                            ? '#E2E8F0'
                                            : 'transparent'
                                    }
                                    color={
                                        buttonSelected === item.tag
                                            ? '#000'
                                            : '#f6f6f6'
                                    }
                                    onClick={() => {
                                        setButtonSelected(item.tag);
                                    }}
                                >
                                    {item.text}
                                </Button>
                            ))}
                        </Box>
                    </Box>
                    <Box
                        style={{
                            height: '100%',
                        }}
                        id="container"
                    >
                        {/* {buttonSelected === 'chart' && (
                            <Box
                                style={{
                                    height: '100%',
                                    width: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                                id="chart"
                            >
                                <Box
                                    display={'flex'}
                                    width={'100%'}
                                    justifyContent={'left'}
                                    marginTop={'10px'}
                                >
                                    <Select
                                        size={'sm'}
                                        variant={'filled'}
                                        width={'auto'}
                                        marginBottom={'10px'}
                                        borderRadius={'6px'}
                                        value={tokenOfInterest}
                                        onChange={(e) => {
                                            setTokenOfInterest(e.target.value);
                                        }}
                                    >
                                        {allTokenAvailables.map((item) => (
                                            <option key={item} value={item}>
                                                {item}
                                            </option>
                                        ))}
                                    </Select>
                                </Box>
                                <Box
                                    className="content"
                                    style={{
                                        height: '100%',
                                        width: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                    }}
                                >
                                    {history?.length > 0 ? (
                                        history.map((item) => {
                                            // This section will change with a list when the backend is ready
                                            return (
                                                <Box key={item.id}>
                                                    Tienes esta oferta{' '}
                                                    {item.order_type}
                                                </Box>
                                            );
                                        })
                                    ) : (
                                        <Box
                                            style={{
                                                height: '100%',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <Text
                                                fontSize="xl"
                                                textAlign={'center'}
                                            >
                                                No tienes órdenes en tu
                                                historial de {tokenOfInterest}.
                                            </Text>
                                        </Box>
                                    )}
                                </Box>
                            </Box>
                        )} */}
                        {buttonSelected === 'orders' && (
                            <Box
                                style={{
                                    height: '100%',
                                    width: '100%',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                                id="orders"
                            >
                                <Box
                                    style={{
                                        height: '100%',
                                        width: '70%',
                                        paddingTop: '10px',
                                    }}
                                    className="offers"
                                >
                                    {availableOffers[tokenOfInterest.name]
                                        ?.length > 0 && (
                                        <Box
                                            width={'100%'}
                                            display={'flex'}
                                            justifyContent={'space-around'}
                                            height={'40px'}
                                            borderBottom={'1px solid #ccc'}
                                        >
                                            <Text>{`Precio (${tokenToExchange.name})`}</Text>
                                            <Text>Cantidad de tokens</Text>
                                            <Text>{`Total (${tokenToExchange.name})`}</Text>
                                        </Box>
                                    )}
                                    {availableOffers[tokenOfInterest.name]
                                        ?.length > 0 ? (
                                        <>
                                            {availableOffers[
                                                tokenOfInterest.name
                                            ]
                                                .filter(
                                                    (item) =>
                                                        item.order_type ===
                                                        'sell'
                                                )
                                                .sort((a, b) => {
                                                    parseFloat(a.order_price) -
                                                        parseFloat(
                                                            b.order_price
                                                        );
                                                })
                                                .slice(0, 5)
                                                .reverse()
                                                .map((item) => {
                                                    // This section will change with a list when the backend is ready
                                                    return (
                                                        <Box
                                                            key={item}
                                                            width={'100%'}
                                                            display={'flex'}
                                                            height={'40px'}
                                                            paddingTop={'10px'}
                                                            borderBottom={
                                                                '1px solid #ccc'
                                                            }
                                                            justifyContent={
                                                                'space-around'
                                                            }
                                                        >
                                                            <Text>
                                                                {parseFloat(
                                                                    item.order_price
                                                                ).toFixed(2)}
                                                            </Text>
                                                            <Text>
                                                                {parseFloat(
                                                                    item.order_quantity
                                                                )}
                                                            </Text>
                                                            <Text>
                                                                {(
                                                                    parseFloat(
                                                                        item.order_price
                                                                    ) *
                                                                    parseFloat(
                                                                        item.order_quantity
                                                                    )
                                                                ).toFixed(2)}
                                                            </Text>
                                                        </Box>
                                                    );
                                                })}
                                            <Box
                                                height={'40px'}
                                                borderBottom={'1px solid #ccc'}
                                            />
                                            {availableOffers[
                                                tokenOfInterest.name
                                            ]
                                                .filter(
                                                    (item) =>
                                                        item.order_type ===
                                                        'buy'
                                                )
                                                .sort((a, b) => {
                                                    parseFloat(a.order_price) -
                                                        parseFloat(
                                                            b.order_price
                                                        );
                                                })
                                                .slice(0, 5)
                                                .reverse()
                                                .map((item) => {
                                                    // This section will change with a list when the backend is ready
                                                    return (
                                                        <Box
                                                            key={item}
                                                            width={'100%'}
                                                            display={'flex'}
                                                            height={'40px'}
                                                            paddingTop={'10px'}
                                                            borderBottom={
                                                                '1px solid #ccc'
                                                            }
                                                            justifyContent={
                                                                'space-around'
                                                            }
                                                        >
                                                            <Text>
                                                                {parseFloat(
                                                                    item.order_price
                                                                ).toFixed(2)}
                                                            </Text>
                                                            <Text>
                                                                {parseFloat(
                                                                    item.order_quantity
                                                                )}
                                                            </Text>
                                                            <Text>
                                                                {(
                                                                    parseFloat(
                                                                        item.order_price
                                                                    ) *
                                                                    parseFloat(
                                                                        item.order_quantity
                                                                    )
                                                                ).toFixed(2)}
                                                            </Text>
                                                        </Box>
                                                    );
                                                })}
                                        </>
                                    ) : (
                                        <Box
                                            style={{
                                                height: '100%',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <Text fontSize="xl">
                                                Aún no hay órdenes en{' '}
                                                {tokenOfInterest.name.toUpperCase()}
                                            </Text>
                                        </Box>
                                    )}
                                </Box>
                                <Box
                                    id="purchaseBlock"
                                    style={{
                                        height: '100%',
                                        width: '30%',
                                        background:
                                            'linear-gradient(253.62deg, rgb(14, 23, 25) 5.9%, rgb(40, 59, 63) 50.27%, rgb(38, 39, 39) 96.9%)',
                                        padding: '10px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        borderRadius: '10px',
                                        justifyContent: 'space-evenly',
                                    }}
                                >
                                    <Box
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            marginBottom: '10px',
                                        }}
                                    >
                                        <Text
                                            color={'#f6f6f6'}
                                            variant={'h4'}
                                            fontSize={'32px'}
                                        >
                                            Compra
                                        </Text>
                                    </Box>
                                    <Box
                                        style={{
                                            height: '90px',
                                            display: 'flex',
                                            justifyContent: 'space-around',
                                            flexDirection: 'column',
                                            background: '#f6f6f6',
                                            borderRadius: '5px',
                                            border: '1px solid black',
                                            padding: '4px',
                                        }}
                                    >
                                        <Text
                                            marginLeft={'5px'}
                                            fontSize={'18px'}
                                        >
                                            Usar
                                        </Text>
                                        <Box
                                            display={'flex'}
                                            justifyContent={'space-between'}
                                            width={'100%'}
                                        >
                                            <Input
                                                onChange={(e) => {
                                                    setOrderToSend({
                                                        ...orderToSend,
                                                        token_quantity:
                                                            parseFloat(
                                                                e.target.value
                                                            ),
                                                    });
                                                    if (
                                                        parseFloat(
                                                            e.target.value
                                                        ) >
                                                            tokenToExchange.totalQuantity ||
                                                        parseFloat(
                                                            e.target.value
                                                        ) <= 0
                                                    )
                                                        toast({
                                                            title: 'El monto no debe superar la cantidad máxima que posee y debe ser mayor a 0',
                                                            status: 'error',
                                                            duration: 5000,
                                                            isClosable: true,
                                                        });
                                                }}
                                                max={
                                                    tokenToExchange.totalQuantity
                                                }
                                                placeholder="Ingrese un monto"
                                                height={'100%'}
                                                width={'auto'}
                                                padding={'0 0 0 10px'}
                                                fontSize={'24px'}
                                                type="number"
                                                style={{
                                                    border: 'none',
                                                    outline: 'none',
                                                }}
                                                _hover={null}
                                                _focusVisible={{
                                                    boxShadow: 'none',
                                                }}
                                            />
                                            <Text paddingRight={2}>
                                                {tokenToExchange.name}
                                            </Text>
                                        </Box>
                                    </Box>

                                    <Text
                                        color={'#f6f6f6'}
                                        marginLeft={'10px'}
                                        fontSize={'18px'}
                                        paddingBottom={'20px'}
                                    >{`Mi saldo disponible: ${tokenToExchange.totalQuantity} ${tokenToExchange.name}`}</Text>

                                    <Box
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            paddingBottom: '20px',
                                        }}
                                    >
                                        <ArrowDownIcon
                                            color={'#f6f6f6'}
                                            width={'25px'}
                                            height={'25px'}
                                        />
                                    </Box>
                                    <Box
                                        style={{
                                            height: '90px',
                                            display: 'flex',
                                            justifyContent: 'space-around',
                                            flexDirection: 'column',
                                            background: '#f6f6f6',
                                            borderRadius: '5px',
                                            border: '1px solid black',
                                            padding: '4px',
                                            marginBottom: '10px',
                                        }}
                                    >
                                        <Text
                                            marginLeft={'5px'}
                                            fontSize={'18px'}
                                        >
                                            Precio límite
                                        </Text>
                                        <Box
                                            display={'flex'}
                                            justifyContent={'space-between'}
                                            width={'100%'}
                                        >
                                            <Input
                                                onChange={(e) => {
                                                    console.log(e.target.value);
                                                    setOrderToSend({
                                                        ...orderToSend,
                                                        order_price: parseFloat(
                                                            e.target.value
                                                        ),
                                                        order_quantity:
                                                            (orderToSend.token_quantity *
                                                                0.99) /
                                                            parseFloat(
                                                                e.target.value
                                                            ),
                                                    });
                                                }}
                                                placeholder="Ingrese un límite"
                                                height={'100%'}
                                                width={'auto'}
                                                padding={'0 0 0 10px'}
                                                fontSize={'24px'}
                                                type="number"
                                                style={{
                                                    border: 'none',
                                                    outline: 'none',
                                                }}
                                                _hover={null}
                                                _focusVisible={{
                                                    boxShadow: 'none',
                                                }}
                                            />
                                            <Text paddingRight={2}>
                                                {tokenToExchange.name}
                                            </Text>
                                        </Box>
                                    </Box>
                                    <Box
                                        style={{
                                            height: '90px',
                                            display: 'flex',
                                            justifyContent: 'space-around',
                                            flexDirection: 'column',
                                            background: '#f6f6f6',
                                            borderRadius: '5px',
                                            border: '1px solid black',
                                            padding: '4px',
                                            marginBottom: '20px',
                                        }}
                                    >
                                        <Text
                                            marginLeft={'5px'}
                                            fontSize={'18px'}
                                        >
                                            {`Comprar ${tokenOfInterest.name}(Estimado)`}
                                        </Text>
                                        <Box
                                            display={'flex'}
                                            justifyContent={'space-between'}
                                            width={'100%'}
                                        >
                                            <Input
                                                disabled
                                                value={
                                                    orderToSend.order_quantity
                                                }
                                                placeholder="Monto a recibir"
                                                height={'100%'}
                                                width={'50%'}
                                                padding={'0 0 0 10px'}
                                                fontSize={'24px'}
                                                type="number"
                                                style={{
                                                    border: 'none',
                                                    outline: 'none',
                                                }}
                                                _hover={null}
                                                _focusVisible={{
                                                    boxShadow: 'none',
                                                }}
                                            />
                                            <Text paddingRight={2}>
                                                {tokenOfInterest.name}
                                            </Text>
                                        </Box>
                                    </Box>
                                    <Button
                                        onClick={handleSettingOrder}
                                        height={'50px'}
                                        background={'#00ebff'}
                                        _hover={{ filter: 'contrast(120%)' }}
                                    >
                                        Confirmar compra
                                    </Button>
                                </Box>
                            </Box>
                        )}
                        {buttonSelected === 'my_orders' && (
                            <Box
                                id="my_orders"
                                style={{
                                    height: '100%',
                                    width: '100%',
                                    display: 'flex',
                                    paddingBlock: '20px',
                                }}
                            >
                                <Box
                                    className="content"
                                    id="myOrders"
                                    style={{
                                        height: '100%',
                                        width: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '20px',
                                        overflowY: 'auto',
                                        maxHeight:
                                            'calc(100vh - 20px * 2 - 50px - 10px * 2 - 50px)',
                                    }}
                                >
                                    {myOrders?.length > 0 ? (
                                        myOrders.map((item) => {
                                            // This section will change with a list when the backend is ready
                                            return (
                                                <Box
                                                    key={item.order_id}
                                                    style={{
                                                        display: 'flex',
                                                        justifyContent:
                                                            'space-between',
                                                        width: '95%',
                                                        alignItems: 'center',
                                                        borderBottom:
                                                            '1px solid #ccc',
                                                        paddingBlock: '10px',
                                                    }}
                                                >
                                                    <Text>
                                                        {item.order_type ===
                                                            'buy' && 'Compra'}
                                                        {item.order_type ===
                                                            'sell' && 'Venta'}
                                                    </Text>
                                                    <Text>
                                                        {`${
                                                            item.order_quantity
                                                        } ${
                                                            item.trading_pair?.split(
                                                                '/'
                                                            )[0]
                                                        }`}
                                                    </Text>
                                                    <Text>
                                                        <ArrowForwardIcon />
                                                    </Text>
                                                    <Text>
                                                        {`${item.order_price} ${
                                                            item.trading_pair?.split(
                                                                '/'
                                                            )[1]
                                                        }`}
                                                    </Text>
                                                    <IconButton
                                                        colorScheme="red"
                                                        onClick={() => {
                                                            onOpen();
                                                            setModalData(item);
                                                        }}
                                                        icon={<DeleteIcon />}
                                                    />
                                                </Box>
                                            );
                                        })
                                    ) : (
                                        <Box
                                            style={{
                                                height: '100%',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <Text
                                                fontSize="xl"
                                                textAlign={'center'}
                                            >
                                                No tienes órdenes postuladas
                                                aún.
                                            </Text>
                                        </Box>
                                    )}
                                </Box>
                            </Box>
                        )}
                        {buttonSelected === 'history' && (
                            <>
                                {history?.length > 0 && (
                                    <>
                                        {isLargerThan800 && (
                                            <Box
                                                style={{
                                                    paddingLeft: '5vw',
                                                    display: 'flex',
                                                    justifyContent:
                                                        'space-around',
                                                    alignItems: 'center',
                                                    gap: '20px',
                                                    width: isLargerThan800
                                                        ? 'calc(50% - 50px)'
                                                        : '100%',
                                                }}
                                            >
                                                <Text>Inversión</Text>
                                                <Text
                                                    width={'150px'}
                                                    textAlign={'center'}
                                                >
                                                    Fecha de transaccion
                                                </Text>
                                            </Box>
                                        )}
                                        <Box
                                            style={{
                                                paddingLeft: '5vw',
                                                display: 'flex',
                                                justifyContent: 'space-around',
                                                alignItems: 'center',
                                                gap: '20px',
                                                width: isLargerThan800
                                                    ? 'calc(50% - 50px)'
                                                    : '100%',
                                            }}
                                        >
                                            <Text>Inversión</Text>
                                            <Text
                                                width={'150px'}
                                                textAlign={'center'}
                                            >
                                                Fecha de transaccion
                                            </Text>
                                        </Box>
                                    </>
                                )}
                                <Box
                                    id="history"
                                    style={{
                                        height: '100%',
                                        width: '100%',
                                        display: 'flex',
                                        flexDirection: isLargerThan800
                                            ? 'row'
                                            : 'column',
                                        flexWrap: isLargerThan800
                                            ? 'wrap'
                                            : 'nowrap',
                                        alignItems: 'center',
                                        gap: '20px',
                                        overflowY: 'auto',
                                        maxHeight:
                                            'calc(100vh - 20px * 2 - 50px - 10px * 2 - 60px)',
                                        paddingTop: '15px',
                                    }}
                                >
                                    {history?.length > 0 ? (
                                        history.map((item) => {
                                            // This section will change with a list when the backend is ready
                                            return (
                                                <Box
                                                    key={item.order_id}
                                                    style={{
                                                        display: 'flex',
                                                        justifyContent:
                                                            'space-around',
                                                        alignItems: 'center',
                                                        gap: '20px',
                                                        width: isLargerThan800
                                                            ? 'calc(50% - 20px)'
                                                            : '100%',
                                                    }}
                                                >
                                                    <Box
                                                        display={'flex'}
                                                        flexDirection={
                                                            isLargerThan800
                                                                ? 'row'
                                                                : 'column'
                                                        }
                                                        justifyContent={
                                                            'center'
                                                        }
                                                        alignItems={'center'}
                                                        gap={
                                                            isLargerThan800
                                                                ? '15px'
                                                                : '0px'
                                                        }
                                                    >
                                                        <Text>
                                                            <ArrowUpIcon
                                                                color={'green'}
                                                            />
                                                            {`${
                                                                item.order_price
                                                            } ${
                                                                item.trading_pair.split(
                                                                    '/'
                                                                )[0]
                                                            }`}
                                                        </Text>
                                                        <Text
                                                            textAlign={'center'}
                                                        >
                                                            <ArrowDownIcon
                                                                color={'red'}
                                                            />

                                                            {`${
                                                                item.order_quantity
                                                            } ${
                                                                item.trading_pair.split(
                                                                    '/'
                                                                )[1]
                                                            }`}
                                                        </Text>
                                                    </Box>
                                                    <Text textAlign={'center'}>
                                                        {item.creation_datetime}
                                                    </Text>
                                                </Box>
                                            );
                                        })
                                    ) : (
                                        <Box
                                            style={{
                                                height: '100%',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <Text
                                                fontSize="xl"
                                                textAlign={'center'}
                                            >
                                                No tienes órdenes en tu
                                                historial.
                                            </Text>
                                        </Box>
                                    )}
                                </Box>
                            </>
                        )}
                    </Box>
                </Box>
            </Box>
        </>
    );
}