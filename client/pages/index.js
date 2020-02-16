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
    // Button,
    Flex,
    Image,
    // Input,
    InputGroup,
    InputRightElement,
    PseudoBox,
    Stack,
    Text,
    ThemeProvider
} from '@chakra-ui/core'
import mockResponse from '../mock/response.json'
import {
    Button,
    Balloon,
    Container,
    Icon,
    TextInput
} from 'nes-react'


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
            <Container title='EthSplainer 2.0' rounded>
                <Box>
                    <Stack spacing={10} py={16}>
                        <Box d={page === 0 ? 'block' : 'none'}>
                            <Stack spacing={8} align='center'>
                                <Flex justify='center' ml={-32}>
                                    <Image
                                        src='/assets/pegabufficorn.png'
                                        size={64}
                                        fallbackSrc='https://www.ethdenver.com/wp-content/themes/understrap/img/pegabufficorn.png'
                                        />
                                    <Box mb={32} w={32}>
                                        <Balloon fromLeft >
                                            <span>What Can I Help You Understand?</span>
                                        </Balloon>
                                    </Box>
                                </Flex>
                                <Flex direction='row' align='center' ml={10}>
                                    <Box w={700}>
                                        <TextInput
                                            width='100%'
                                            varient='filled'
                                            placeholder=
                                            'xpub6CUGRUonZSQ4TWtTMmzXdrXDtypWKiKrhko4egpiMZbpiaQL2jkwSB1icqYh2cfDfVxdx4df189oLKnC5fSwqPfgyP3hooxujYzAu3fDVmz'
                                            borderRadius={5}
                                            onChange={handleChange}
                                            value={input}
                                        />
                                    </Box>
                                    <Button success onClick={() => getTxDetails(input)} varientColor='blue'>
                                        Learn
                                    </Button>
                                </Flex>
                            </Stack>
                        </Box>
                        <Box d={page === 1 ? 'inline' : 'none'} w='full'>
                            <Stack spacing={10}>
                                <Flex wordBreak='break-all'>
                                    <Flex justify='space-between' fontSize={24}>
                                        <Container title='Raw Data' rounded>
                                            {map(response, (tokenObj, index) => {
                                                return (
                                                    <PseudoBox
                                                        as='text'
                                                        fontSize={16}
                                                        font='inherit'
                                                        color={rainbowColors[index % 7]}
                                                        onMouseEnter={() => setDisplayToken(get(tokenObj, 'token'))}
                                                        onMouseLeave={() => setDisplayToken(null)}
                                                        onClick={() => pushToPinned(tokenObj.token)}
                                                        _hover={{ color: 'blue.500', cursor: 'pointer' }}
                                                    >
                                                        {tokenObj.token}
                                                    </PseudoBox>
                                                )}
                                            )}
                                        </Container>
                                        <Box w='100%'>
                                            <Button primary onClick={() => goBack()} >Back</Button>
                                        </Box>
                                    </Flex>
                                </Flex>
                                <Container w='100%' rounded>
                                    <Box color='red.500' pl={4}>
                                        {displayText ? displayText : 'Hover over the transaction'}
                                    </Box>
                                </Container>
                                <Stack mt={16} spacing={16} justify='center'>
                                    {pinnedDescriptons.map((description, index) => {
                                        return (
                                            <Box>

                                                <Container width='100%' rounded>
                                                    <Flex direction='row' justify='space-between'>
                                                        <Box color={rainbowColors[index + 1]}>{description}</Box>
                                                        <Button error onClick={() => filterFromPinned(index)}>Close</Button>
                                                    </Flex>
                                                </Container>
                                            </Box>
                                        )
                                    })}
                                </Stack>
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
