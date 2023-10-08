import { Box, Spinner, Text } from '@chakra-ui/react';
import React from 'react';

export default function OnLoading() {
    return (
        <Box
            style={{
                width: '100%',
                height: 'calc(100vh - 50px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: '20px',
            }}
        >
            <Spinner color="#00EBFF" width={'50px'} height={'50px'} />
            <Text fontWeight={'bold'}>Aguarde un momento por favor...</Text>
        </Box>
    );
}
