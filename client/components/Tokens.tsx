/* eslint-disable @next/next/no-img-element */

import { Token } from '@/app/page'
interface TokensProps {
  tokens: Token[]
  isLoading: boolean
  onSelectToken: (token: Token) => void
}

const Tokens: React.FC<TokensProps> = ({ tokens, isLoading, onSelectToken }) => {

  return (
    <div className='tokens-container'>
      <div style={{ display: isLoading ? 'grid' : '', placeItems: isLoading ? 'center' : '' }} className="tokens">     
        {
          isLoading ? 
          <p>Loading...</p> :
          <>
            {
              tokens.map(token => 
                <div key={token.id} onClick={() => onSelectToken(token)} className="token">
                  <div className="token-container">
                    <div className="token-container-data1">
                      <img className="token_img" src={token.logoURI} alt="" />
                      <div className="token-container-data1-detail">
                        <p className="token_name">{token.name}</p>
                        <p className="token_value">0 {token.symbol}</p>
                      </div>
                    </div>
                    <div className="token-container-data2">
                      <p className="token_value">$0</p>
                      <img className="pin" src="https://www.svgrepo.com/show/485854/pin1.svg" alt="" />
                    </div>
                  </div>
                </div>
              )
            }
          </>
        }
      </div>
    </div>
  )
}

export default Tokens