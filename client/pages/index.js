import React, { useCallback, useEffect, useState } from 'react'
import Head from 'next/head'
import Nav from '../components/nav'
import axios from 'axios'
import {
    concat,
    filter,
    find,
    get
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
        if(response) {
            const obj = find(response, r => r.token === displayToken)
            const text = obj ? `${get(obj, 'title')}: ${get(obj, 'value')}` : 'Hover over transaction'
            setDisplayText(text)
        }
    }, [displayToken])

    const pushToPinned = useCallback((token) => {
        const obj = find(response, r => r.token === token)
        const newDescription = `${get(obj, 'title')}: ${get(obj, 'value')}`
        const existingDescription = find(pinnedDescriptons, description => description === newDescription)
        if (existingDescription) return
        const newPinnedDescriptions = concat(newDescription, pinnedDescriptons)
        setPinnedDescriptions(newPinnedDescriptions)
    }, [response, pinnedDescriptons])

    const filterFromPinned = useCallback((key) => {
        const newPinnedDescriptions = filter(pinnedDescriptons, (description, index) => {
            return index !== key
        })
        setPinnedDescriptions(newPinnedDescriptions)
    }, [response, pinnedDescriptons])


    const TokenBox = ({ children: token, color }) => {
        return (
            <PseudoBox
                as='text'
                color={color}
                onMouseEnter={() => setDisplayToken(token)}
                onMouseLeave={() => setDisplayToken('')}
                onClick={() => pushToPinned(token)}
                _hover={{ color: 'teal.900', cursor: 'pointer' }}
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
        <Box bg='blue.200' mx={-8} mt={-8} mb={-64}>
            <Stack spacing={10} py={16} px={64}>
                <Flex justify='space-around' align='center'>
                    <Image
                        src='/assets/pegabufficorn.png'
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
                        <TokenBox color='pink.400'>{version}</TokenBox>
                        <TokenBox color='red.400'>{depth}</TokenBox>
                        <TokenBox color='orange.400'>{fingerprint}</TokenBox>
                        <TokenBox color='yellow.400'>{index}</TokenBox>
                        <TokenBox color='green.400'>{chaincode}</TokenBox>
                        <TokenBox color='blue.400'>{keydata}</TokenBox>
                        <TokenBox color='purple.400'>{checksum}</TokenBox>
                    </Text>
                </Flex>
                <Text>
                    {displayText ? displayText : 'Hover over the transaction'}
                </Text>
                {pinnedDescriptons.map((description, index) => {
                    return (
                        <Flex
                            justify='center'
                            align='center'
                            key={index}
                            onClick={() => filterFromPinned(index)}
                            border='1px solid'
                            borderRadius={6}
                            borderColor='green.800'
                        >
                            <Text>{description}</Text>
                        </Flex>
                    )
                })}
            </Stack>
        </Box>
    )
}

export default App
