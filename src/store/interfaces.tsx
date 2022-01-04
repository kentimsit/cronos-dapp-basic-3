import { ethers } from "ethers";
import React from "react";

export type Dispatch = React.Dispatch<IAction>;

export interface IState {
  refreshing: IRefreshing;
  wallet: IWallet;
  walletWeb3Modal: IWalletWeb3Modal;
  queryResults: IQueryResults;
}

export interface IAction {
  type: string;
  payload: any;
}

export interface IRefreshing {
  status: boolean;
  message: string;
}

export const defaultRefreshing = {
  status: false,
  message: "Please wait a few seconds...",
};

// Interfaces.tsx
export interface IWallet {
  walletProviderName: string; // for example, "metamask" or "defiwallet"
  address: string; // 0x address of the user
  browserWeb3Provider: any; // Web3 provider connected to the wallet's browser extension
  serverWeb3Provider: ethers.providers.JsonRpcProvider | null; // cloud based Web3 provider for read-only
  wcConnector: any; // connector object provided by some wallet connection methods, stored if relevant
  wcProvider: any; // provider object provided by some wallet connection methods, stored if relevant
  connected: boolean; // is the wallet connected to the Dapp, or not?
  chainId: number; // for example, 25 for Cronos mainnet, and 338 for Cronos testnet
}

export const defaultWallet: IWallet = {
  walletProviderName: "",
  address: "",
  browserWeb3Provider: null,
  serverWeb3Provider: null,
  wcConnector: null,
  wcProvider: null,
  connected: false,
  chainId: 0,
};

export interface IWalletWeb3Modal {
  fetching: boolean;
  address: string;
  web3: any;
  provider: any;
  connected: boolean;
  chainId: number;
  networkId: number;
  assets: IAssetData[];
  showModal: boolean;
  pendingRequest: boolean;
  result: any | null;
}

export const defaultWalletWeb3Modal: IWalletWeb3Modal = {
  fetching: false,
  address: "",
  web3: null,
  provider: null,
  connected: false,
  chainId: 1,
  networkId: 1,
  assets: [],
  showModal: false,
  pendingRequest: false,
  result: null,
};

export interface IAssetData {
  symbol: string;
  name: string;
  decimals: string;
  contractAddress: string;
  balance?: string;
}

export interface IQueryResults {
  lastBlockNumber: number;
  croBalance: number;
  erc20Balance: number;
  lastTxHash: string;
}

export const defaultQueryResults: IQueryResults = {
  lastBlockNumber: 0,
  croBalance: 0,
  erc20Balance: 0,
  lastTxHash: "",
};
