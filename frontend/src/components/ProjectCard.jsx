import {
    AspectRatio,
    Box,
    Button,
    Image,
    Text,
    useToast,
} from '@chakra-ui/react';
import React, { useEffect } from 'react';
import styles from '../utils/constants/styles';
import { useNavigate } from 'react-router-dom';

export default function ProjectCard({ project }) {
    const navigate = useNavigate();
    const toast = useToast();

    const handleRedirect = () => {
        if (project.button === 'Próximamente')
            toast({
                title: 'Este proyecto se encuentra en proceso...',
                isClosable: true,
                duration: 5000,
                status: 'info',
            });
        else navigate(`/projects/${project.projectIdentifier}`);
    };

    return (
        <Box
            style={{
                width: '250px',
                height: '400px',
                backgroundColor: styles.bgWhite,
                borderRadius: '10px',
                boxShadow: 'rgba(107, 107, 107, 0.25) 0px 15px 10px',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <AspectRatio ratio={16 / 9} borderTopRadius={'10px'}>
                {project.image === '' ? (
                    <Box style={{ height: '100%', width: '100%' }}>
                        <Text>Aún no hay imagen</Text>
                    </Box>
                ) : (
                    <Image
                        borderRadius={'6px'}
                        src={project.image}
                        alt={project.title}
                        layout={'fill'}
                        objectFit={'contain'}
                        objectPosition={'center'}
                    />
                )}
            </AspectRatio>
            <Box
                padding={'10px'}
                display={'flex'}
                flexDirection={'column'}
                height={'100%'}
                justifyContent={'space-between'}
            >
                <Text
                    fontSize={'1.75rem'}
                    textAlign={'center'}
                    lineHeight={'1.8rem'}
                    fontWeight={700}
                    color={'#003a47'}
                    margin={0}
                >
                    {project.title}
                </Text>
                <Box
                    display={'flex'}
                    flexDirection={'column'}
                    justifyContent={'space-between'}
                    height={'35%'}
                    width={'100%'}
                    margin={'0px'}
                >
                    <Text
                        style={{
                            fontSize: '1rem',
                            marginBlock: '0px 5px',
                            color: '#003a47',
                        }}
                    >
                        {project.minInvest}
                    </Text>
                    <Text
                        style={{
                            fontSize: '1rem',
                            marginBlock: '0px 5px',
                            color: '#003a47',
                        }}
                    >
                        {project.benefit}
                    </Text>
                    <Text
                        style={{
                            fontSize: '1rem',
                            marginBlock: '0px 5px',
                            color: '#003a47',
                        }}
                    >
                        {project.investTime}
                    </Text>
                </Box>
                <Button
                    onClick={handleRedirect}
                    style={{
                        backgroundColor: 'transparent',
                        borderRadius: '6px',
                        paddingBlock: '10px',
                        cursor:
                            project.button === 'Próximamente'
                                ? 'no-drop'
                                : 'pointer',
                        border:
                            project.button === 'Próximamente'
                                ? '3px solid rgba(62, 152, 172, .5)'
                                : '3px solid #3e98ac',
                        color:
                            project.button === 'Próximamente'
                                ? 'rgba(62, 152, 172, .5)'
                                : '#3e98ac',
                    }}
                >
                    {project.button}
                </Button>
            </Box>
        </Box>
    );
}
