import { BellIcon, DeleteIcon } from '@chakra-ui/icons';
import { Box, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
//import getAllProjets from '../utils/api/get/getAllProjects';
//import getNotifications from '../utils/api/get/getAllNotifications';
import styles from '../utils/constants/styles';
import handleLogout from '../utils/functions/handleLogout';

export default function Navbar({ indexes }) {
    const [title, setTitle] = useState('');
    const [notifications, setNotifications] = useState([]);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const fetch = async () => {
        const notificationsAPI = await getNotifications();
        setNotifications(notificationsAPI);
    };

    const handleEraseNotification = async (id) => {
        // const { data } = fetchAPI.delete(`/notifications/${id}`)
        setNotifications(notifications.filter((e) => e.id !== id));
    };

    useEffect(() => {
        const path = indexes.find(
            (index) => window.location.pathname === index.href
        )?.text;
        if (window.location.pathname.includes('/projects/')) {
            getAllProjets().then((project) => {
                const projectTitle = project.projects.find(
                    (e) => e.id === pathname.split('/')[2]
                ).data.asset.name;
                setTitle(projectTitle);
            });
        } else if (window.location.pathname.includes('/validation')) {
            setTitle('Validación de identidad');
        } else {
            setTitle(path);
        }
    }, [navigate]);

    useEffect(() => {
        fetch();
    }, []);

    return (
        <>
            <Box
                style={{
                    width: '100%',
                    height: '50px',
                    position: 'fixed',
                    top: '0px',
                    right: '0px',
                    backgroundColor: '#0e1719',
                    display: 'flex',
                    zIndex: 5,
                }}
            >
                <Box width={'20vw'} />
                <Box
                    width={'80vw'}
                    color={'white'}
                    display={'flex'}
                    justifyContent={'space-between'}
                    alignItems={'center'}
                    paddingInline={'15px'}
                >
                    <Box />
                    <Text fontWeight={'bold'} fontSize={'1.5rem'}>
                        {title}
                    </Text>
                    <Box
                        style={{
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                        }}
                    >
                        <Box cursor={'pointer'}>
                            <BellIcon
                                onClick={() => {
                                    setIsNotificationsOpen(
                                        !isNotificationsOpen
                                    );
                                }}
                                height={'100%'}
                                width={'30px'}
                                color={styles.whiteText}
                            />
                        </Box>
                        {notifications.length > 0 && (
                            <>
                                <Box
                                    style={{
                                        position: 'absolute',
                                        top: '7px',
                                        right: '130px',
                                        height: '8px',
                                        width: '8px',
                                        borderRadius: '100%',
                                        backgroundColor: 'red',
                                        zIndex: 6,
                                    }}
                                />
                            </>
                        )}
                        <Box>
                            <Text cursor="pointer" onClick={handleLogout}>
                                Cerrar sesión
                            </Text>
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Box
                style={{
                    height: 'auto',
                    width: '78vw',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'absolute',
                    background: styles.backgroundComunyt,
                    justifyContent: 'space-around',
                    top: '55px',
                    left: isNotificationsOpen ? '21vw' : '-140vw',
                    padding: '10px',
                    borderRadius: '15px',
                    boxShadow: styles.boxShadow,
                    zIndex: '3',
                    transition: 'all .4s',
                    gap: '15px',
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
                            width={'100%'}
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
                            onClick={() => handleEraseNotification(item.id)}
                        />
                    </Box>
                ))}
            </Box>
        </>
    );
}
