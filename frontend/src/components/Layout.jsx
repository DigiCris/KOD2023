import { AspectRatio, Box, useMediaQuery } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import indexes from '../utils/constants/indexes';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import wpp_logo from '../assets/wpp_logo.png';

export default function Layout({ children }) {
    const [isLargerThan800] = useMediaQuery('(min-width: 800px)');
    const [navigation, setNavigation] = useState([...indexes]);
    const [firstload, setFirstload] = useState(true);
    const to = useNavigate();

    const fetching = async () => {
        const { response } = await getKycStatus();
        if (parseInt(response.kyc) > 1)
            setNavigation(navigation.filter((e) => e.href !== '/validation'));
        if (firstload && response.kyc <= 1) {
            setFirstload(false);
            return to('/validation');
        }
        if (firstload) {
            setFirstload(false);
            return to('/projects');
        }
    };

    useEffect(() => {
        fetching();
    }, []);

    return (
        <>
            <main
                style={
                    isLargerThan800
                        ? {
                              display: 'flex',
                              flexDirection: isLargerThan800 ? 'row' : 'column',
                              backgroundColor: '#e9e8e8',
                              height: '100vh',
                              width: '100vw',
                          }
                        : {
                              display: 'flex',
                              flexDirection: isLargerThan800 ? 'row' : 'column',
                              backgroundColor: '#e9e8e8',
                              minHeight: '100vh',
                              width: '100vw',
                          }
                }
            >
                <Sidebar
                    isLargerThan800={isLargerThan800}
                    indexes={navigation}
                />
                {isLargerThan800 && <Navbar indexes={navigation} />}
                <Box
                    style={{
                        width: '20%',
                    }}
                />
                {isLargerThan800 && (
                    <Box
                        style={{
                            position: 'fixed',
                            bottom: '1vh',
                            left: '1vw',
                            zIndex: '100',
                            padding: '8px',
                            borderRadius: '100px 100px 100px 25px',
                            background:"#f6f6f6",
                            cursor: 'pointer'
                        }}
                        onClick={() => window.open('https://wa.me/5491172875357?text=Necesito%20ayuda%20para%20invertir.', '_blank')}
                    >
                        <AspectRatio ratio={1} width={'45px'}>
                            <img src={wpp_logo} alt="Whatsapp Logo" />
                        </AspectRatio>
                    </Box>
                )}
                {children}
            </main>
        </>
    );
}
