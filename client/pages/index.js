import React, { useCallback, useEffect, useState } from 'react'
import Head from 'next/head'
import Nav from '../components/nav'
import axios from 'axios'
import {
    concat
} from 'lodash'
import {
    Box,
    Button,
    Flex,
    Image,
    Input,
    InputGroup,
    InputRightElement,
    PseudoBox,
    Stack,
    Text,
    ThemeProvider
} from '@chakra-ui/core'
import mockResponse from '../mock/response.json'

const hoverColor = 'blue.500'

const App = () => {
    return (
        <ThemeProvider>
            <Home />
        </ThemeProvider>
    )
}

const Home = () => {
    const [response, setResponse] = useState()
    const [version, setVersion] = useState()
    const [depth, setDepth] = useState()
    const [fingerprint, setFingerprint] = useState()
    const [index, setIndex] = useState()
    const [chaincode, setChaincode] = useState()
    const [keydata, setKeydata] = useState()
    const [checksum, setChecksum] = useState()
    const [displayToken, setDisplayToken] = useState('')
    const [displayText, setDisplayText] = useState('')
    const [pinnedDescriptons, setPinnedDescriptions] = useState([])

    useEffect(() => {
        const getResponse = async () => {
            try {
                const response = await axios.post('http://localhost:8080',
                    {"input":"xpub6CUGRUonZSQ4TWtTMmzXdrXDtypWKiKrhko4egpiMZbpiaQL2jkwSB1icqYh2cfDfVxdx4df189oLKnC5fSwqPfgyP3hooxujYzAu3fDVmz"}
                )
                console.log({ response })
            } catch (err) {
                console.log({ err })
                setResponse(mockResponse)
            }
        }
        getResponse()
        if (response) {
            setVersion(getTokenFromTitle('Version'))
            setDepth(getTokenFromTitle('Depth'))
            setFingerprint(getTokenFromTitle('Fingerprint'))
            setIndex(getTokenFromTitle('Index'))
            setChaincode(getTokenFromTitle('Chaincode'))
            setKeydata(getTokenFromTitle('Keydata'))
            setChecksum(getTokenFromTitle('Checksum'))
        }
    }, [response])

    useEffect(() => {
        if(response && displayToken) {
            const description = response.find(r => r.token === displayToken).description
            setDisplayText(description)
        }
    }, [displayToken])

    const pushToPinned = useCallback((token) => {
        const newDescription = response.find(r => r.token === token).description
        const newPinnedDescriptions = concat(newDescription, pinnedDescriptons)
        console.log({ newDescription, pinnedDescriptons, newPinnedDescriptions })
        setPinnedDescriptions(newPinnedDescriptions)
    }, [response, pinnedDescriptons])


    const TokenBox = ({ children: token }) => {
        return (
            <PseudoBox
                as='text'
                onMouseEnter={() => setDisplayToken(token)}
                onMouseLeave={() => setDisplayText('')}
                onClick={() => pushToPinned(token)}
                _hover={{ color: hoverColor, cursor: 'pointer' }}
            >
                {token}
            </PseudoBox>
        )
    }

    const getTokenFromTitle = useCallback((title) => {
        if(response) {
            return response.find(r => r.title === title).token
        }
    }, [response])

    return (
        <Box bg='yellow.500' mx={-8} mt={-8} mb={-64}>
            <Stack spacing={10} py={16} px={64}>
                <Flex justify='space-around' align='center'>
                    <Image
                        src='../public/assets/pegabufficorn.png'
                        size={32}
                        fallbackSrc='https://www.ethdenver.com/wp-content/themes/understrap/img/pegabufficorn.png'
                    />
                    <InputGroup>
                        <Input
                            w={500}
                            varient='filled'
                            placeholder='What can I help you understand?'
                            borderRadius={5}
                        />
                        <InputRightElement>
                            <Button varientColor='blue' mt={1} mr={1}>
                                Send
                            </Button>
                        </InputRightElement>
                    </InputGroup>
                </Flex>
                <Flex wordBreak='break-all'>
                    <Text>
                        <TokenBox>{version}</TokenBox>
                        <TokenBox>{depth}</TokenBox>
                        <TokenBox>{fingerprint}</TokenBox>
                        <TokenBox>{index}</TokenBox>
                        <TokenBox>{chaincode}</TokenBox>
                        <TokenBox>{keydata}</TokenBox>
                        <TokenBox>{checksum}</TokenBox>
                    </Text>
                </Flex>
                <Text>
                    {displayText}
                </Text>
                {pinnedDescriptons.map((description, index) => {
                    return (
                        <Text key={index}>
                            {description}
                        </Text>
                    )
                })}
            </Stack>
        </Box>
    )
}

export default App
