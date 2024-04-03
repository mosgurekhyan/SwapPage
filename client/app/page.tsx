/* eslint-disable @next/next/no-img-element */
'use client'

import styles from "./page.module.css"
import { ChangeEvent, useEffect, useState } from "react"
import Tokens from "@/components/Tokens"
import axios1Inch from "@/utils/1inch/axiosInstance"
import { create1InchProxyUrl } from "@/utils/1inch/api"
import { useAccount, useSendTransaction } from 'wagmi'
import axios from "axios"

interface SelectedToken {
  address: string;
  symbol: string;
  decimals: number;
  name: string;
  logoURI: string;
  tags: string[];
  id: string;
}

export interface Token {
  address: string;
  symbol: string;
  decimals: number;
  name: string;
  logoURI: string;
  tags: string[];
  id: string;
}

interface TxDetails {
  to: string | null
  data: string | null
  value: number | null
}

const Home: React.FC = () => {
  const [ showTokens, setShowTokens ] = useState(false)
  const [ showTokens2, setShowTokens2 ] = useState(false)
  const [ tokens, setTokens ] = useState<Token[]>([])
  const [ isLoading, setIsLoading ] = useState<boolean>(false)
  const [ selectedToken, setSelectedToken ] = useState<SelectedToken>(
    {
      "address": "0x53e562b9b7e5e94b81f10e96ee70ad06df3d2657",
      "symbol": "BABY",
      "decimals": 18,
      "name": "BabySwap Token",
      "logoURI": "https://tokens.1inch.io/0x53e562b9b7e5e94b81f10e96ee70ad06df3d2657.png",
      "tags": [
        "tokens"
      ],
      id: '0x53e562b9b7e5e94b81f10e96ee70ad06df3d2657'
    }
  )
  const [ selectedToken2, setSelectedToken2 ] = useState<SelectedToken>(
    {
      "address": "0x9ac983826058b8a9c7aa1c9171441191232e8404",
      "symbol": "SNX",
      "decimals": 18,
      "name": "Synthetix",
      "logoURI": "https://tokens.1inch.io/0x9ac983826058b8a9c7aa1c9171441191232e8404.png",
      "tags": [
        "tokens"
      ],
      id: '0x9ac983826058b8a9c7aa1c9171441191232e8404'
    }
  )
  const [ inputValue, setInputValue ] = useState<number>(1)
  const { address, chainId } = useAccount()
  const [ prices, setPrices ] = useState<any>(null)
  const [ result, setResult ] = useState<number>(0.0848)
  const [ txDetails, setTxDetails ] = useState<TxDetails>({
    to: null,
    data: null,
    value: null
  })

  // const { data, sendTransaction } = useSendTransaction({
  //   request: {
  //     from: address,
  //     to: String(txDetails.to),
  //     data: String(txDetails.data),
  //     value: String(txDetails.value)
  //   }
  // })

  useEffect(() => {
    if (!tokens.length) {
      setIsLoading(true)
      axios1Inch
      .get(create1InchProxyUrl('/swap/v6.0/1/tokens'))
      .then(res => {
        const tokenData = res.data?.tokens
        if (tokenData) {
          const tokenArray = Object.keys(tokenData).map(key => ({
            ...tokenData[key],
            id: key,
          }))
          setTokens(tokenArray)
        }
      })
      .catch(err => console.log('Error:', err))
      .finally(() => setIsLoading(false))
    }
  }, [ tokens, setTokens ])

  const selectToken = (token: Token) => {
    setSelectedToken(token)
    setShowTokens(false)
  }

  const selectToken2 = (token: Token) => {
    setSelectedToken2(token)
    setShowTokens2(false)
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(event.target.value)
    setInputValue(isNaN(newValue) ? 0 : newValue)
  }

  const getPrices = async () => {
    const res = await axios.get('http://localhost:3001/priceToken', {
      params: { addressOne: selectedToken.address, addressTwo: selectedToken2.address }
    })

    setPrices(res.data)
  }

  const getConversion = () => {
    getPrices()
    if (prices) {
      setResult(inputValue * prices.ratio.toFixed(5))
    }
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.inputs}>
          <div className={styles.inputContainer1}>
            <p className={styles.role}>You pay</p>
            <div className={styles.data}>
              <div onClick={() => setShowTokens(true)} className={styles.selectedValueContainer}>
                <img className={styles.selectedValueContainerImg} src={selectedToken?.logoURI} alt="" />
                <p>{selectedToken?.symbol}</p>
                <img className={styles.down} src='https://www.svgrepo.com/show/430918/down.svg' alt="" />
              </div>
              <input value={inputValue} onChange={handleInputChange} className={styles.input} type="number" />
            </div>
            <div className={styles.values}>
              <p className={styles.valuesName}>{selectedToken?.name}</p>
              <p className={styles.valuesResult}>~$11 023</p>
            </div>
          </div>
          <div className={styles.inputContainer2}>
            <p className={styles.role}>You receive</p>
            <div className={styles.data}>
              <div onClick={() => setShowTokens2(true)} className={styles.selectedValueContainer}>
                <img className={styles.selectedValueContainerImg} src={selectedToken2?.logoURI} alt="" />
                <p>{selectedToken?.symbol}</p>
                <img className={styles.down} src='https://www.svgrepo.com/show/430918/down.svg' alt="" />
              </div>
              <p className={styles.result}>{result}</p>
            </div>
            <div className={styles.values}>
              <p className={styles.valuesName}>{selectedToken2?.name}</p>
              <p className={styles.valuesResult}>~$11 023</p>
            </div>
          </div>
        </div>
        { showTokens && <Tokens isLoading={isLoading} tokens={tokens} onSelectToken={selectToken} /> }
        { showTokens2 && <Tokens isLoading={isLoading} tokens={tokens} onSelectToken={selectToken2} /> }
        {
          !(showTokens || showTokens2) &&
          <div className={styles.buttonsContainer}>
            <button onClick={getConversion} className={styles.btn}>Get Conversion</button>
            <w3m-button />
            <button className={styles.btn}>Swap Tokens</button>
          </div>
        }
      </div>
    </main>
  )
}

export default Home