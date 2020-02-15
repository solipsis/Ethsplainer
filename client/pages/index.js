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
    Icon,
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

const rainbowColors = {
    1: 'pink.400',
    2: 'red.400',
    3: 'orange.400',
    4: 'yellow.400',
    5: 'green.400',
    6: 'blue.400',
    7: 'purple.400'
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
                        <TokenBox color={rainbowColors[1]}>{version}</TokenBox>
                        <TokenBox color={rainbowColors[2]}>{depth}</TokenBox>
                        <TokenBox color={rainbowColors[3]}>{fingerprint}</TokenBox>
                        <TokenBox color={rainbowColors[4]}>{index}</TokenBox>
                        <TokenBox color={rainbowColors[5]}>{chaincode}</TokenBox>
                        <TokenBox color={rainbowColors[6]}>{keydata}</TokenBox>
                        <TokenBox color={rainbowColors[7]}>{checksum}</TokenBox>
                    </Text>
                </Flex>
                <Flex
                    justify='space-between'
                    key={index}
                    border='1px solid'
                    borderRadius={6}
                    borderColor='red.500'
                >
                    <Text pl={4}>
                        {displayText ? displayText : 'Hover over the transaction'}
                    </Text>
                </Flex>
                {pinnedDescriptons.map((description, index) => {
                    return (
                        <Flex
                            justify='space-between'
                            key={index}
                            border='1px solid'
                            borderRadius={6}
                            borderColor={rainbowColors[index + 1]}
                        >
                            <Text pl={4}>{description}</Text>
                            <PseudoBox pr={1} _hover={{ cursor: 'pointer' }}>
                                <Icon
                                    onClick={() => filterFromPinned(index)}
                                    name='close'
                                    size='11px'
                                />
                            </PseudoBox>
                        </Flex>
                    )
                })}
            </Stack>
        </Box>
    )
}

export default App
