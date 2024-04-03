import { I1InchSwapParams } from "../helpers";
import axios1Inch from "./axiosInstance";

const oneInchBaseUrl = "https://api.1inch.dev";
// const oneInchBaseUrl = process.env.REACT_APP_1INCH_BASE_URL || "";

export const create1InchProxyUrl = (url: string) =>
  `?url=${oneInchBaseUrl}${url}`;
export const broadcastApiUrl1Inch = (chainId: string | number) =>
  create1InchProxyUrl(`/tx-gateway/v1.1/${chainId}/broadcast`);
export const apiBaseUrl1Inch = (chainId: string | number) =>
  create1InchProxyUrl(`/swap/v5.2/${chainId}`);

export function apiRequestUrl(path: string, queryParams: any) {
  return path + "?" + new URLSearchParams(queryParams).toString();
}

export async function buildTxForSwap1Inch(
  swapParams: I1InchSwapParams,
  chainId: string | number
) {
  const url = apiRequestUrl(
    create1InchProxyUrl(`/swap/v6.0/${chainId}/swap`),
    swapParams
  );
  try {
    const response = await axios1Inch.get(url);

    return response.data.tx;
  } catch (err) {
    console.error(err);
  }
}
