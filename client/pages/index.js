import React, { useCallback, useEffect, useState } from 'react'
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
    Flex,
    Image,
    PseudoBox,
    Stack,
    ThemeProvider
} from '@chakra-ui/core'
import mockResponse from '../mock/response.json'
import {
    Button,
    Balloon,
    Container,
    TextInput
} from 'nes-react'

const responsiveFontSizes = [
    8,
    10,
    12,
    14
]

const rainbowColors = {
    0: 'pink.400',
    1: 'red.400',
    2: 'orange.400',
    3: 'yellow.400',
    4: 'green.400',
    5: 'blue.400',
    6: 'purple.400',
}

const App = () => {
    return (
        <ThemeProvider>
            <Home />
        </ThemeProvider>
    )
}

const Home = () => {
    const [response, setResponse] = useState()
    const [displayToken, setDisplayToken] = useState('')
    const [inputType, setInputType] = useState('')
    const [pinnedObjects, setPinnedObjects] = useState([])
    const [page, setPage] = useState(0)
    const [input, setInput] = useState('')
    const [errorState, setErrorState] = useState(false)
    const [errorText, setErrorText] = useState('Sorry, I don\'t understand this format.')
    const [vitalik, setVitalik] = useState(false)


    const handleChange = event => {
        setErrorState(false)
        setPage(0)
        setInput(event.target.value)
    }

    useEffect(() => {
        const getResponse = async () => {
            try {
                //await axios.options('http://localhost:8080')
                await axios.options('https://calm-thicket-60588.herokuapp.com/')
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
            //const goResponse = await axios.post('http://localhost:8080', { input })
            const goResponse = await axios.post('https://calm-thicket-60588.herokuapp.com/', { input })
            console.log({ responseData: goResponse.data })
            if (typeof get(goResponse, 'data', null) === 'string') {
                setErrorState(true)
                setErrorText('Sorry, I don\'t understand this format.')
            }
            setResponse(get(goResponse, 'data'))
            setPage(1)
        } catch (err) {
            console.log(`API err: ${err}`)
            setErrorState(true)
            setErrorText('Something went wrong. I\'m sorry.')
            setResponse(mockResponse)
        }
    }, [input])

    const goBack = useCallback(() => {
        setInput('')
        setPage(0)
    }, [])

    return (
        <Box m={8}>
            <Container title='EthSplainer 2.0' rounded>
                <Box pb={10}>
                    <Stack spacing={10} >
                        <Flex d={page === 0 || (page === 1 && errorState) ? 'block' : 'none'} fontSize={responsiveFontSizes}>
                            <Stack spacing={8} justify='center' align='center'>
                                <Flex justify='center' ml={-32}>
                                    <Image
                                        onClick={() => setVitalik(!vitalik)}
                                        src={vitalik ? '/assets/vitalik.png' : '/assets/pegabufficorn.png'}
                                        size={[32, 64]}
                                        fallbackSrc='https://www.ethdenver.com/wp-content/themes/understrap/img/pegabufficorn.png'
                                        />
                                    <Box pl={[1, 2, 3, 4]} mb={[4, 8, 16, 32]} w={[4, 8, 16, 32]}>
                                        <Balloon fromLeft >
                                            <Box>What Can I Help You Understand?</Box>
                                        </Balloon>
                                    </Box>
                                </Flex>
                                <Flex direction='row' align='center'>
                                    <Box w={[175, 350, 500, 700]}>
                                        <TextInput
                                            style={{ height: '2.75rem' }}
                                            width='100%'
                                            varient='filled'
                                            placeholder='xpub6CUGRUonZSQ4TWtTMmzXdrXDtypWKiKrhko4egpiMZbpiaQL2jkwSB1icqYh2cfDfVxdx4df189oLKnC5fSwqPfgyP3hooxujYzAu3fDVmz'
                                            borderRadius={5}
                                            onChange={handleChange}
                                            value={input}
                                        />
                                    </Box>
                                    <Button
                                        success
                                        onClick={() => getTxDetails(input)}
                                        style={{ marginLeft : 16 }}
                                    >
                                        <Box>
                                            Learn
                                        </Box>
                                    </Button>
                                </Flex>
                                <Box>
                                    <Container rounded>
                                        <Stack ml={8} justifyContent='center' alignItems='center' spacing={4}>
                                            <Box>
                                                Or click one of the examples below to populate the input.
                                            </Box>
                                            <PseudoBox
                                                _hover={{ cursor: 'pointer' }}
                                                onClick={() => setInput('0xc45367afb97f4e79fe6cccfed0bea22a8c63d6fbd7ec4f85aa2541d05075f8af')}
                                            >
                                                {'* Eth Tx Hash: 0xc45367afb9...'}
                                            </PseudoBox>
                                            <PseudoBox
                                                _hover={{ cursor: 'pointer' }}
                                                onClick={() => setInput('0xf86c2285012a05f2008252089490e9ddd9d8d5ae4e3763d0cf856c97594dea7325884431a977b29170008026a02f92f54ad283f2cc962f22be7d12d6fff8c9ad51b04b8fc6c60a1f791ca4627ea00120aa6101d4207c15c13128fa3162e824d518466027f860d4a4eb534ae68634')}
                                            >
                                                {'* Raw Tx Hex: 0xf86c2285012...'}
                                            </PseudoBox>
                                            <PseudoBox
                                                _hover={{ cursor: 'pointer' }}
                                                onClick={() => setInput('60806040526018600055348015601457600080fd5b5060358060226000396000f3006080604052600080fd00a165627a7a723058204551648437b45b4433da110519d9c1ca35c91af7cab828e41346248b1d002a660029')}
                                            >
                                                {'* EVM Opcodes: 0x6080604052...'}
                                            </PseudoBox>
                                        </Stack>
                                    </Container>
                                </Box>
                                <Flex textAlign='center' d={page === 1 && errorState ? 'inline' : 'none'} w='full' color='red.500'>
                                    {errorText}
                                </Flex>
                            </Stack>
                        </Flex>
                        <Box d={page === 1 && !errorState ? 'inline' : 'none'} w='full' fontSize={responsiveFontSizes} pt={16} pb='17rem'>
                            <Stack spacing={4}>
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
                                                        tokenObj.colorIndex = index % 7
                                                        setDisplayToken(tokenObj)
                                                    }}
                                                    onMouseLeave={() => {
                                                        setDisplayToken(null)
                                                    }}
                                                    onClick={() => pushToPinned(tokenObj, index)}
                                                    _hover={{ color: `${rainbowColors[index % 7]}`, cursor: 'pointer' }}
                                                >
                                                    {tokenObj.token}
                                                </PseudoBox>
                                            )}
                                        ) : null}
                                    </Container>
                                    <Box w='25%' ml={4}>
                                        <Button primary onClick={() => goBack()}><Box>Back</Box></Button>
                                    </Box>
                                </Flex>
                                <Box display={displayToken || get(pinnedObjects, 'length', 0) === 0 ? 'block' : 'none'}>
                                    <Container w='100%' rounded title={get(displayToken, 'title', 'Hover Over Data Field')}>
                                        <Box color='rgb(33, 37, 41);' pl={4}>
                                            {displayToken ? (
                                                <Box wordBreak='break-all'>
                                                    <Box color={rainbowColors[displayToken.colorIndex]}>
                                                        {displayToken.value}
                                                    </Box>
                                                    <br />
                                                    <Box color={rainbowColors[displayToken.colorIndex]}>
                                                        {displayToken.description}
                                                    </Box>
                                                </Box>
                                            ) : (
                                                <Box wordBreak='break-all'>
                                                    <Box>
                                                        Hover over a color coded portion of the transaction to learn more.
                                                    </Box>
                                                    <br />
                                                    <Box>
                                                        Click on a section to pin it's description.
                                                    </Box>
                                                </Box>
                                            )}
                                        </Box>
                                    </Container>
                                </Box>
                                <Stack spacing={4} justify='center'>
                                    {pinnedObjects.map((obj, index) => {
                                        return (
                                            <Box>
                                                <Container rounded title={obj.title}>
                                                    <Flex direction='row' justify='space-between'>
                                                        <Flex direction='column' wordBreak='break-all'>
                                                            <Box color={rainbowColors[obj.colorIndex]}>{obj.value}</Box>
                                                            <br />
                                                            <Box color={rainbowColors[obj.colorIndex]}>{obj.description}</Box>
                                                        </Flex>
                                                        <Box mt={-6} mr={2} w={3}>
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
            <title>EthSplainer 2.0</title>
        </Box>
    )
}

export default App
