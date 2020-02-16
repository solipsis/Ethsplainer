import React, { useCallback, useEffect, useState } from 'react'
import Head from 'next/head'
import Nav from '../components/nav'
import axios from 'axios'
import {
    concat,
    filter,
    find,
    get,
    map
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
import { Container } from 'nes-react'


const App = () => {
    return (
        <ThemeProvider>
            <Home />
        </ThemeProvider>
    )
}

const rainbowColors = {
    0: 'pink.400',
    1: 'red.400',
    2: 'orange.400',
    3: 'yellow.400',
    4: 'green.400',
    5: 'blue.400',
    6: 'purple.400',
}
// xpub6CUGRUonZSQ4TWtTMmzXdrXDtypWKiKrhko4egpiMZbpiaQL2jkwSB1icqYh2cfDfVxdx4df189oLKnC5fSwqPfgyP3hooxujYzAu3fDVmz

// 0xf88738843b9aca0082785394030c09afd8a0e756d114bfb8c8446fbb80e3831180a443bb3608000000000000000000000000000000000000000000000000000000005e487ead26a04e8cab72974de24e13d07c3dec4ab5970519b9441b7d736018045963ba0783fda019c87ecd75abe3e9eaca66023153315addd5628da40dc96a43c6fbb5457753cb

const Home = () => {
    const [response, setResponse] = useState()
    const [index, setIndex] = useState()
    const [displayToken, setDisplayToken] = useState('')
    const [displayText, setDisplayText] = useState('')
    const [pinnedDescriptons, setPinnedDescriptions] = useState([])
    const [page, setPage] = useState(0)
    const [input, setInput] = useState('')


    const handleChange = event => setInput(event.target.value)

    useEffect(() => {
        const getResponse = async () => {
            try {
                await axios.options('http://localhost:8080')
            } catch (err) {
                console.log({ err })
            }
        }
        getResponse()
    }, [])

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
                fontSize={16}
                font='inherit'
                color={color}
                onMouseEnter={() => setDisplayToken(token)}
                onMouseLeave={() => setDisplayToken(null)}
                onClick={() => pushToPinned(token)}
                _hover={{ color: 'blue.500', cursor: 'pointer' }}
            >
                {token}
            </PseudoBox>
        )
    }

    const getTokenFromTitle = useCallback((title) => {
        if(response) {
            return get(find(response, r => r.title === title), 'token')
        }
    }, [response])

    const getTxDetails = useCallback(async (input) => {
        try {
            console.log({ input })
            const response = await axios.post('http://localhost:8080', { input })
            console.log({ responseData: response.data })
            setResponse(get(response, 'data'))
            setPage(1)
            console.log({ page })
        } catch (err) {
            console.log(`API err: ${err}`)
        }
    }, [input])

    const goBack = useCallback(() => {
        setPage(0)
    }, [])

    return (
        <>
            <Container>
                <Box font='inherit' bg='teal.900' mx={-8} mt={-8} mb={-64}>
                    <Flex justify='flex-end'>
                        <Icon pt={16} size={12} pr={32} name='arrow-back' color='blue.900' display={page === 1 ? 'block' : 'none'} onClick={() => goBack()} />
                    </Flex>
                    <Box textAlign='center' color='blue.500' fontSize={36} textAlign='center'>
                        <span font='inherit' >EthSplainer 2.0</span>
                    </Box>
                    <Stack spacing={10} py={16} px={64}>
                        <Box d={page === 0 ? 'block' : 'none'}>
                            <Flex justify='space-around' align='center'>
                                <Image
                                    src='/assets/pegabufficorn.png'
                                    size={64}
                                    fallbackSrc='https://www.ethdenver.com/wp-content/themes/understrap/img/pegabufficorn.png'
                                />
                                <Flex direction='row'>
                                    <Input
                                        w={500}
                                        varient='filled'
                                        placeholder='What can I help you understand?'
                                        borderRadius={5}
                                        onChange={handleChange}
                                        value={input}
                                    />
                                    <Button onClick={() => getTxDetails(input)} varientColor='blue' mt={1} mr={1}>
                                        Get
                                    </Button>
                                </Flex>
                            </Flex>
                        </Box>
                        <Box d={page === 1 ? 'block' : 'none'}>
                            <Stack spacing={10}>
                                <Flex wordBreak='break-all'>
                                    <Box fontSize={24}>
                                        {map(response, (tokenObj, index) => {
                                            return (
                                                <TokenBox key={index} color={rainbowColors[index % 7]}>{tokenObj.token}</TokenBox>
                                            )
                                        } )}
                                    </Box>
                                </Flex>
                                <Flex
                                    justify='space-between'
                                    key={index}
                                    border='1px solid'
                                    borderRadius={6}
                                    borderColor='red.500'
                                >
                                    <Text color='red.500' pl={4}>
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
                                            <Text color={rainbowColors[index + 1]} pl={4}>{description}</Text>
                                            <PseudoBox pr={1} _hover={{ cursor: 'pointer' }}>
                                                <Icon
                                                    color={rainbowColors[index + 1]}
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
                    </Stack>
                </Box>
            </Container>
            <link
                href="https://fonts.googleapis.com/css?family=Press+Start+2P"
                rel="stylesheet"
            />
        </>
    )
}

export default App
