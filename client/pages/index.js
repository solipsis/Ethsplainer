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
import {
    Avatar,
    Balloon,
    Button,
    Checkbox, 
    Container,
    Icon,
    List,
    Progress, 
    Radios, 
    TextArea,
    TextInput
} from 'nes-react'

import mockResponse from '../mock/response.json'

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
                color={color}
                onMouseEnter={() => setDisplayToken(token)}
                onMouseLeave={() => setDisplayToken('')}
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
            const response = await axios.post('http://localhost:8080', { "input": input.toString() })
            console.log({ responseData: response.data })
            setResponse(get(response, 'data'))
        } catch (err) {
            console.log(err)
        }
    }, [input])

    return (
    <>
        <Box bg='teal.900' mx={-8} mt={-8} mb={-64}>
            <Stack spacing={10} py={16} px={64}>
                <Text textAlign='center' color='blue.500' fontSize={64} fontWeight='bold'>EthSplainer 2.0</Text>
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
                            onChange={handleChange}
                            value={input}
                        />
                        <InputRightElement>
                            <Button onClick={() => getTxDetails(input)} varientColor='blue' mt={1} mr={1}>
                                Get
                            </Button>
                        </InputRightElement>
                    </InputGroup>
                </Flex>
                <Flex wordBreak='break-all'>
                    <Text fonstSize={24}>
                        {map(response, (tokenObj, index) => {
                            return (
                                <TokenBox key={index} color={rainbowColors[index % 7]}>{tokenObj.token}</TokenBox>
                            )
                        } )}
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
    <link href="https://fonts.googleapis.com/css?family=Press+Start+2P" rel="stylesheet" />
    </>    
    )
}

export default App
