import { Box, useMediaQuery } from '@chakra-ui/react'

export default function Separator() {
  const [isLargerThan800] = useMediaQuery('(min-width: 800px)')
  
  return (
    <Box
        style={{
            height: isLargerThan800 ? '60px' : '50px',
            width: '100%',
        }}
    />
  )
}
