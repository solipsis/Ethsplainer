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
    const [displayToken, setDisplayToken] = useState('')
    const [inputType, setInputType] = useState('')
    const [pinnedObjects, setPinnedObjects] = useState([])
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
            const obj = find(response, r => r)
            if(obj) {
                setInputType(obj.type)
            }
            setPinnedObjects([])
        }
    }, [response])

    const pushToPinned = useCallback((tokenObj, index) => {
        const obj = find(response, r => r.token === tokenObj.token && r.description === tokenObj.description)
        obj.colorIndex = index % 7
        const existingObj = find(pinnedObjects, obj => obj.token === tokenObj.token && obj.description === tokenObj.description)
        if (existingObj) return
        const newPinnedObjects = concat(obj, pinnedObjects)
        setPinnedObjects(newPinnedObjects)
    }, [response, pinnedObjects])

    const filterFromPinned = useCallback((key) => {
        const newPinnedObjects = filter(pinnedObjects, (obj, index) => {
            return index !== key
        })
        setPinnedObjects(newPinnedObjects)
    }, [response, pinnedObjects])


    const getTxDetails = useCallback(async (input) => {
        try {
            if(!input) input = 'xpub6CUGRUonZSQ4TWtTMmzXdrXDtypWKiKrhko4egpiMZbpiaQL2jkwSB1icqYh2cfDfVxdx4df189oLKnC5fSwqPfgyP3hooxujYzAu3fDVmz'
            const goResponse = await axios.post('http://localhost:8080', { input })
            console.log({ responseData: goResponse.data })
            setResponse(get(goResponse, 'data'))
            setPage(1)
        } catch (err) {
            console.log(`API err: ${err}`)
        }
    }, [input])

    const goBack = useCallback(() => {
        setPage(0)
    }, [])

    return (
        <>
            <Container title='EthSplainer 2.0' rounded style={{ height : "100vh" }}>
                <Box>
                    <Stack spacing={10} py={16} >
                        <Box d={page === 0 ? 'block' : 'none'} fontSize={16}>
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
                                    <Button success onClick={() => getTxDetails(input)} style={{ marginLeft : 16 }}>
                                        Learn
                                    </Button>
                                </Flex>
                            </Stack>
                        </Box>
                        <Box d={page === 1 ? 'inline' : 'none'} w='full' fontSize={12}>
                            <Stack spacing={10}>
                                <Flex wordBreak='break-all' justify='space-between'>
                                    <Container title={inputType ? inputType : ''} rounded>
                                        {response ? map(response, (tokenObj, index) => {
                                            return (
                                                <PseudoBox
                                                    as='text'
                                                    key={index}
                                                    font='inherit'
                                                    color={rainbowColors[index % 7]}
                                                    opacity={!displayToken || displayToken === tokenObj ? '1': '0.4'}
                                                    onMouseEnter={() => {
                                                        tokenObj.colorIndex = index
                                                        setDisplayToken(tokenObj)
                                                    }}
                                                    onMouseLeave={() => setDisplayToken(null)}
                                                    onClick={() => pushToPinned(tokenObj, index)}
                                                    _hover={{ color: `${rainbowColors[index % 7]}`, cursor: 'pointer' }}
                                                >
                                                    {tokenObj.token}
                                                </PseudoBox>
                                            )}
                                        ) : null}
                                    </Container>
                                    <Box w='22%'>
                                        <Button primary onClick={() => goBack()}>Back</Button>
                                    </Box>
                                </Flex>
                                <Container w='100%' rounded title={get(displayToken, 'title', 'Hover Over Tx')}>
                                    <Box color='rgb(33, 37, 41);' pl={4}>
                                        {displayToken ? (
                                            <>
                                                <Box color={rainbowColors[displayToken.colorIndex]}>
                                                    {displayToken.value}
                                                </Box>
                                                <Box color={rainbowColors[displayToken.colorIndex]}>
                                                    {displayToken.description}
                                                </Box>
                                            </>
                                         ) : (
                                             <>
                                                <Box>
                                                    Hover over a color coded portion
                                                </Box>
                                                <Box>
                                                    of the transaction to learn more.
                                                </Box>
                                            </>
                                         )}
                                    </Box>
                                </Container>
                                <Stack mt={4} spacing={4} justify='center'>
                                    {pinnedObjects.map((obj, index) => {
                                        console.log(obj)
                                        return (
                                            <Box>
                                                <Container width='100%' rounded title={obj.title}>
                                                    <Flex direction='row' justify='space-between'>
                                                        <Flex direction='column'>
                                                            <Box color={rainbowColors[obj.colorIndex]}>{obj.value}</Box>
                                                            <Box color={rainbowColors[obj.colorIndex]}>{obj.description}</Box>
                                                        </Flex>
                                                        <Box mt={-6} mr={2} w={3} fontSize={8}>
                                                            <Button error onClick={() => filterFromPinned(index)}>X</Button>
                                                        </Box>
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
