import {
    BellIcon,
    DeleteIcon,
    ExternalLinkIcon,
    HamburgerIcon,
} from '@chakra-ui/icons';
import { Box, Image, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../assets/typography.svg';
import getAllNotifications from '../utils/api/get/getAllNotifications';
import styles from '../utils/constants/styles';
import handleLogout from '../utils/functions/handleLogout';

export default function SideBar({ isLargerThan800, indexes }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);

    const fetch = async () => {
        const notificationsAPI = await getAllNotifications();
        setNotifications(notificationsAPI);
    };

    const handleEraseNotification = (id) => {
        setNotifications(notifications.filter((e) => e.id !== id));
    };

    useEffect(() => {
        fetch();
    }, []);

    return (
        <>
            {isLargerThan800 ? (
                <Box
                    sx={{
                        zIndex: '6',
                        width: '20vw',
                        height: '100vh',
                        padding: '10px',
                        display: 'flex',
                        position: 'fixed',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        backgroundColor: '#0e1719',
                        borderBottomRightRadius: '25px',
                    }}
                >
                    <Box>
                        <Box
                            paddingBlock={'10px'}
                            display={'flex'}
                            justifyContent={'center'}
                        >
                            <Image
                                objectFit={'contain'}
                                width={'80%'}
                                src={logo}
                                alt="logo"
                            />
                        </Box>
                        <hr />
                        <Box
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '15px',
                                padding: '10px 5px',
                            }}
                        >
                            {indexes.map((item) => (
                                <Box key={item.text}>
                                    <NavLink
                                        to={item.href}
                                        style={{
                                            textDecoration: 'none',
                                            color: styles.whiteText,
                                        }}
                                    >
                                        {item.text}
                                    </NavLink>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </Box>
            ) : (
                <>
                    <Box
                        style={{
                            height: '50px',
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'space-between',
                            paddingInline: '20px',
                            alignItems: 'center',
                            background: styles.backgroundComunyt,
                            position: 'fixed',
                            zIndex: 5,
                        }}
                    >
                        <Box
                            style={{
                                height: '25px',
                                width: '25px',
                                padding: '0px',
                                cursor: 'pointer',
                            }}
                        >
                            <HamburgerIcon
                                onClick={() => {
                                    setIsMenuOpen(!isMenuOpen);
                                    setIsNotificationsOpen(false);
                                }}
                                color={styles.whiteText}
                                height={'100%'}
                                width={'100%'}
                            />
                        </Box>
                        <Box
                            display={'flex'}
                            width={'50%'}
                            alignItems={'center'}
                            height={'100%'}
                            justifyContent={'center'}
                        >
                            <Image
                                width={'180px'}
                                height={'100%'}
                                objectFit={'contain'}
                                src={logo}
                                alt="logo"
                            />
                        </Box>
                        <Box
                            style={{
                                display: 'flex',
                                gap: '10px',
                            }}
                        >
                            <Box
                                style={{
                                    height: '25px',
                                    width: '25px',
                                    cursor: 'pointer',
                                }}
                            >
                                <BellIcon
                                    onClick={() => {
                                        setIsNotificationsOpen(
                                            !isNotificationsOpen
                                        );
                                        setIsMenuOpen(false);
                                    }}
                                    height={'100%'}
                                    width={'100%'}
                                    color={styles.whiteText}
                                />
                                {notifications.length > 0 && (
                                    <>
                                        <Box
                                            style={{
                                                position: 'absolute',
                                                top: '10px',
                                                right: '55px',
                                                height: '8px',
                                                width: '8px',
                                                borderRadius: '100%',
                                                backgroundColor: 'red',
                                            }}
                                        />
                                    </>
                                )}
                            </Box>
                            <Box
                                style={{
                                    height: '25px',
                                    width: '25px',
                                    cursor: 'pointer',
                                }}
                            >
                                <ExternalLinkIcon
                                    transform={'rotate(225deg)'}
                                    onClick={handleLogout}
                                    height={'100%'}
                                    width={'100%'}
                                    color={styles.whiteText}
                                />
                            </Box>
                        </Box>
                    </Box>
                    <Box
                        style={{
                            width: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'fixed',
                            background: styles.backgroundComunyt,
                            justifyContent: 'space-around',
                            top: isMenuOpen ? '60px' : `calc(-10px*2 - 24px*${indexes.length})`,
                            left: '10px',
                            padding: '10px',
                            borderRadius: '15px',
                            boxShadow: styles.boxShadow,
                            zIndex: '2',
                            transition: 'all .35s ease-out',
                        }}
                    >
                        {indexes.map((item) => (
                            <Box key={item.text}>
                                <NavLink
                                    to={item.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    style={{
                                        textDecoration: 'none',
                                        color: styles.whiteText,
                                    }}
                                >
                                    {item.text}
                                </NavLink>
                            </Box>
                        ))}
                    </Box>
                    <Box
                        style={{
                            height: 'auto',
                            width: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'fixed',
                            background: styles.backgroundComunyt,
                            justifyContent: 'space-around',
                            top: isNotificationsOpen ? '55px' : '-800px',
                            right: '5px',
                            left: '5px',
                            padding: '10px',
                            borderRadius: '15px',
                            boxShadow: styles.boxShadow,
                            zIndex: '3',
                            transition: 'all .4s',
                            gap: '10px',
                            marginInline: 'auto',
                        }}
                    >
                        {notifications.length === 0 && (
                            <Text
                                marginBlock={'5px'}
                                textAlign={'center'}
                                color={styles.whiteText}
                            >
                                No hay notificaciones por el momento
                            </Text>
                        )}
                        {notifications.map((item) => (
                            <Box
                                width={'100%'}
                                display={'flex'}
                                justifyContent={'space-between'}
                                key={item.id}
                            >
                                <Text
                                    margin={0}
                                    width={'90%'}
                                    color={styles.whiteText}
                                >
                                    {item.text}
                                </Text>
                                <DeleteIcon
                                    cursor={'pointer'}
                                    color={styles.whiteText}
                                    marginBlock={'auto'}
                                    height={'20px'}
                                    width={'20px'}
                                    onClick={() =>
                                        handleEraseNotification(item.id)
                                    }
                                />
                            </Box>
                        ))}
                    </Box>
                </>
            )}
        </>
    );
}
