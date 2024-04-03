import BigNumber from "bignumber.js";

export const TEN = new BigNumber(10);

export const toWei = (number: number, decimals = 18) =>
  new BigNumber(number).times(TEN.pow(decimals));

export interface I1InchSwapParams {
  src: string;
  dst: string;
  amount: string;
  from: string;
  slippage: number;
  protocols?: string;
  fee?: number;
  gasPrice?: string;
  complexityLevel?: number;
  parts?: number;
  mainRouteParts?: number;
  gasLimit?: number;
  includeTokensInfo?: boolean;
  includeProtocols?: boolean;
  includeGas?: boolean;
  connectorTokens?: string;
  permit?: string;
  receiver?: string;
  referrer?: string;
  allowPartialFill?: boolean;
  disableEstimate?: boolean;
  usePermit2?: boolean;
}

export const generate1InchSwapParmas = (
  from: string,
  to: string,
  amount: number,
  account: string,
  slippage: number,
  disableEstimate?: boolean,
  allowPartialFill?: boolean,
  includeTokensInfo?: boolean,
  includeProtocols?: boolean,
  includeGas?: boolean
): I1InchSwapParams => {
  return {
    src: from, // The address of the token you want to swap from
    dst: to, // The address of the token you want to swap to
    amount: toWei(amount).toString(), // The amount of the fromToken you want to swap (in wei)
    from: account || "", // Wallet address from which the swap will be initiated
    slippage: slippage / 10000, // The maximum acceptable slippage percentage for the swap (e.g., 1 for 1%)
    disableEstimate: disableEstimate ?? false, // Whether to disable estimation of swap details (set to true to disable)
    allowPartialFill: allowPartialFill ?? false, // Whether to allow partial filling of the swap order (set to true to allow)
    includeTokensInfo: includeTokensInfo ?? false, // Include tokens info in response
    includeProtocols: includeProtocols ?? false, // Include Protocols info in response
    includeGas: includeGas ?? false, // Include Gas info in response
  };
};

export function getSigner(library: any, account: string) {
  return library.getSigner(account).connectUnchecked();
}

