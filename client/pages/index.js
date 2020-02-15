import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Nav from '../components/nav'
import axios from 'axios'
import {
    Flex,
    Image,
    Input,
    PseudoBox,
    Text
} from '@chakra-ui/core'
import mockResponse from '../mock/response.json'


const Home = () => {
    const [response, setResponse] = useState()
    const [version, setVersion] = useState()
    const [depth, setDepth] = useState()
    const [fingerprint, setFingerprint] = useState()
    const [index, setIndex] = useState()
    const [chaincode, setChaincode] = useState()
    const [keydata, setKeydata] = useState()
    const [checksum, setChecksum] = useState()

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
            setVersion(response.find(r => r.title === 'Version').token)
            setDepth(response.find(r => r.title === 'Depth').token)
            setFingerprint(response.find(r => r.title === 'Fingerprint').token)
            setIndex(response.find(r => r.title === 'Index').token)
            setChaincode(response.find(r => r.title === 'Chaincode').token)
            setKeydata(response.find(r => r.title === 'Keydata').token)
            setChecksum(response.find(r => r.title === 'Checksum').token)
            console.log({ version, depth })
            console.log({ response })
        }
    }, [response])

    return (
        <Flex justify='space-between' align='center' w='100%'>
                <Image
                    src='../public/assets/pegabufficorn.png'
                    size={100}
                    fallbackSrc='https://www.ethdenver.com/wp-content/themes/understrap/img/pegabufficorn.png'
                />
                <Flex maxWidth='100rem' wordBreak='break-all'>
                    <Text>
                        <PseudoBox as='text' _hover={{ color: 'green', cursor: 'pointer' }}>{version}</PseudoBox>
                        <PseudoBox as='text' _hover={{ color: 'green', cursor: 'pointer' }}>{depth}</PseudoBox>
                        <PseudoBox as='text' _hover={{ color: 'green', cursor: 'pointer' }}>{fingerprint}</PseudoBox>
                        <PseudoBox as='text' _hover={{ color: 'green', cursor: 'pointer' }}>{index}</PseudoBox>
                        <PseudoBox as='text' _hover={{ color: 'green', cursor: 'pointer' }}>{chaincode}</PseudoBox>
                        <PseudoBox as='text' _hover={{ color: 'green', cursor: 'pointer' }}>{keydata}</PseudoBox>
                        <PseudoBox as='text' _hover={{ color: 'green', cursor: 'pointer' }}>{checksum}</PseudoBox>
                    </Text>
                </Flex>
        </Flex>
        // <div>
        //     <Head>
        // <title>Home</title>
        // <link rel="icon" href="/favicon.ico" />
        //     </Head>

        //     <Nav />

        //     <div className="hero">
        //     <h1 className="title">Welcome to Next.js!</h1>
        //     <p className="description">
        //         To get started, edit <code>pages/index.js</code> and save to reload.
        //     </p>

        //     <div className="row">
        //         <a href="https://nextjs.org/docs" className="card">
        //         <h3>Documentation &rarr;</h3>
        //         <p>Learn more about Next.js in the documentation.</p>
        //         </a>
        //         <a href="https://nextjs.org/learn" className="card">
        //         <h3>Next.js Learn &rarr;</h3>
        //         <p>Learn about Next.js by following an interactive tutorial!</p>
        //         </a>
        //         <a
        //         href="https://github.com/zeit/next.js/tree/master/examples"
        //         className="card"
        //         >
        //         <h3>Examples &rarr;</h3>
        //         <p>Find other example boilerplates on the Next.js GitHub.</p>
        //         </a>
        //     </div>
        //     </div>

        //     <style jsx>{`
        //     .hero {
        //         width: 100%;
        //         color: #333;
        //     }
        //     .title {
        //         margin: 0;
        //         width: 100%;
        //         padding-top: 80px;
        //         line-height: 1.15;
        //         font-size: 48px;
        //     }
        //     .title,
        //     .description {
        //         text-align: center;
        //     }
        //     .row {
        //         max-width: 880px;
        //         margin: 80px auto 40px;
        //         display: flex;
        //         flex-direction: row;
        //         justify-content: space-around;
        //     }
        //     .card {
        //         padding: 18px 18px 24px;
        //         width: 220px;
        //         text-align: left;
        //         text-decoration: none;
        //         color: #434343;
        //         border: 1px solid #9b9b9b;
        //     }
        //     .card:hover {
        //         border-color: #067df7;
        //     }
        //     .card h3 {
        //         margin: 0;
        //         color: #067df7;
        //         font-size: 18px;
        //     }
        //     .card p {
        //         margin: 0;
        //         padding: 12px 0 0;
        //         font-size: 13px;
        //         color: #333;
        //     }
        //     `}</style>
        // </div>
    )
}

export default Home
