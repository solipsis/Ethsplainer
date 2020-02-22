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
    Link,
    PseudoBox,
    Stack,
    ThemeProvider
} from '@chakra-ui/core'
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

    const handleErrorState = (boolean) => {
        setErrorState(boolean)
        setPage(0)
    }

    const handleChange = event => {
        handleErrorState(false)
        setPage(0)
        setInput(event.target.value)
    }

    const handleSelectExample = (input) => {
        handleErrorState(false)
        return setInput(input)
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
                handleErrorState(true)
                setErrorText('Sorry, I don\'t understand this format.')
            }
            if(!errorState) {
                setResponse(get(goResponse, 'data'))
                setPage(1)
            }
        } catch (err) {
            console.log(`API err: ${err}`)
            handleErrorState(true)
            setErrorText('Something went wrong. I\'m sorry.')
        }
    }, [input])

    const goBack = useCallback(() => {
        setInput('')
        setPage(0)
    }, [])

    return (
        <Box pt={[2]} m={[2, 4, 6, 8]}>
            <Container title='EthSplainer 2.0' rounded>
                <Box minH={['2xl', 'sm', 'xl', '2xl']}>
                    <Stack spacing={10}>
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
                                            placeholder='xpub6CUGRUonZSQ4TWtTMmzXdrXDtypWKiKrhko4egpiMZbpiaQL2jkwSB1icqYh2cfDfVxdx4df189oLKnC5fSwqPfgyP3hooxujYzAu3fDVmz'
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
                                                onClick={() => handleSelectExample('xpub6CUGRUonZSQ4TWtTMmzXdrXDtypWKiKrhko4egpiMZbpiaQL2jkwSB1icqYh2cfDfVxdx4df189oLKnC5fSwqPfgyP3hooxujYzAu3fDVmz')}
                                            >
                                                {'* XPUB: xpub6CUGRUon4TWtTMm...'}
                                            </PseudoBox>
                                            <PseudoBox
                                                _hover={{ cursor: 'pointer' }}
                                                onClick={() => handleSelectExample('0xf86c2285012a05f2008252089490e9ddd9d8d5ae4e3763d0cf856c97594dea7325884431a977b29170008026a02f92f54ad283f2cc962f22be7d12d6fff8c9ad51b04b8fc6c60a1f791ca4627ea00120aa6101d4207c15c13128fa3162e824d518466027f860d4a4eb534ae68634')}
                                            >
                                                {'* Raw Tx Hex: 0xf86c2285012...'}
                                            </PseudoBox>
                                            <PseudoBox
                                                _hover={{ cursor: 'pointer' }}
                                                onClick={() => handleSelectExample('60806040526018600055348015601457600080fd5b5060358060226000396000f3006080604052600080fd00a165627a7a723058204551648437b45b4433da110519d9c1ca35c91af7cab828e41346248b1d002a660029')}
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
                        <Box d={page === 1 && !errorState ? 'inline' : 'none'} w='full' fontSize={responsiveFontSizes} pt={[2, 4, 6, 8]}>
                            <Box minH={['2xs', '2xs', '11rem', '11rem']}>
                                <Container rounded title={get(displayToken, 'title', 'Learn About Eth!')}>
                                    <Flex direction='row' justify='space-between'>
                                        <Box color='rgb(33, 37, 41);' pr={[2, 4, 6, 8]}>
                                            {displayToken ? (
                                                <Box whiteSpace='pre-wrap'>
                                                    <Box wordBreak='break-all' color={rainbowColors[displayToken.colorIndex]}>
                                                        {displayToken.value}
                                                    </Box>
                                                    <br />
                                                    <Box wordBreak='keep-all' color={rainbowColors[displayToken.colorIndex]}>
                                                        {displayToken.description}
                                                    </Box>
                                                </Box>
                                            ) : (
                                                <Box whiteSpace='pre-wrap' wordBreak='keep-all'>
                                                    <Box>
                                                        Hover over a color coded portion of the transaction to learn more.
                                                    </Box>
                                                    <br />
                                                    <Box>
                                                        Or click on a section to pin its description.
                                                    </Box>
                                                </Box>
                                            )}
                                        </Box>
                                        <Box minW={['3rem', '4rem', '6rem', '7rem']}>
                                            <Button primary onClick={() => goBack()}><Box>Back</Box></Button>
                                        </Box>
                                    </Flex>
                                </Container>
                            </Box>
                            <Stack spacing={4}>
                                <Flex whiteSpace='pre-wrap' wordBreak='break-all' justify='space-between'>
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
                                </Flex>
                                <Stack spacing={4} justify='center'>
                                    {pinnedObjects.map((obj, index) => {
                                        return (
                                            <Box>
                                                <Container rounded title={obj.title}>
                                                    <Flex direction='row' justify='space-between'>
                                                        <Flex direction='column' whiteSpace='pre-wrap'>
                                                            <Box wordBreak='break-all' color={rainbowColors[obj.colorIndex]}>{obj.value}</Box>
                                                            <br />
                                                            <Box color={rainbowColors[obj.colorIndex]}>{obj.description}</Box>
                                                        </Flex>
                                                        <Box mt={-6} mr={4} w={3} fontSize={[10, 10, 10, 12]}>
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
                <Box fontSize={responsiveFontSizes} m={[2, 4, 6, 8]} whiteSpace='pre-wrap' wordBreak='break-all'>
                    See the code: <Link isExternal href='https://github.com/solipsis/ethsplainer'>https://github.com/solipsis/ethsplainer</Link>
                </Box>
            </Container>
            <link
                href="https://fonts.googleapis.com/css?family=Press+Start+2P"
                rel="stylesheet"
            />
            <title>EthSplainer 2.0</title>
            <meta name="description" content="An education tool to help new and existing Ethereum users better understand the data and construction of things like xpubs, transactions, and raw transaction data - all within a super sweet UI!"/>
            <meta name="keywords" content="Ethereum, EthSplainer, eth, erc20, erc-20, xpub, xpubs, raw transaction data, raw tx, educational tool, cryptocurrency, blockchain" />
        </Box>
    )
}

export default App