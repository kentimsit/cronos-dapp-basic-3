// wallet-metamask.ts

// Injected wallet
// Works with MetaMask in browser or in in-app browser

import { ethers } from "ethers"; // npm install ethers

import { IWallet, defaultWallet } from "../store/interfaces";
import * as utils from "./utils";
import * as config from "../config/config";

// One feature of MetaMask is that the Dapp developer
// can programmatically
// change the network that the browser
// extension is connected to.
// This feature is implemented below,
// to automatically set - up Cronos
export const switchNetwork = async () => {
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: config.configVars.rpcNetwork.chainIdHex }],
    });
  } catch (e) {
    console.log(e);
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: config.configVars.rpcNetwork.chainIdHex,
          chainName: config.configVars.rpcNetwork.chainName,
          rpcUrls: [config.configVars.rpcNetwork.rpcUrl],
          nativeCurrency: config.configVars.rpcNetwork.nativeCurrency,
          blockExplorerUrls: [config.configVars.rpcNetwork.blockExplorerUrl],
        },
      ],
    });
  }
};

// Main login flow for injected wallet like MetaMask
export const connect = async (): Promise<IWallet> => {
  try {
    let chainId = await window.ethereum.request({ method: "eth_chainId" });
    if (!(chainId === config.configVars.rpcNetwork.chainIdHex)) {
      await switchNetwork();
      await utils.delay(2000);
      return defaultWallet;
    }
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    // It is possible to subscribe to events chainChanged,
    // accountsChanged or disconnect,
    // and reload the Dapp whenever one of these events occurs
    window.ethereum.on("chainChanged", utils.reloadApp);
    window.ethereum.on("accountsChanged", utils.reloadApp);
    window.ethereum.on("disconnect", utils.reloadApp);

    return {
      ...defaultWallet,
      walletProviderName: "metamask",
      address: accounts[0],
      browserWeb3Provider: new ethers.providers.Web3Provider(window.ethereum),
      serverWeb3Provider: new ethers.providers.JsonRpcProvider(
        config.configVars.rpcNetwork.rpcUrl
      ),
      connected: true,
      chainId: utils.hexToInt(
        await window.ethereum.request({ method: "eth_chainId" })
      ),
    };
  } catch (e) {
    window.alert(e);
    return defaultWallet;
  }
};
