// wallet-defiwallet.ts
import { ethers } from "ethers"; // npm install ethers

// This is the SDK provided by Crypto.com DeFi Wallet
import { DeFiWeb3Connector } from "deficonnect"; // npm install deficonnect

import * as config from "../config/config";
import * as utils from "./utils";
import { IWallet, defaultWallet } from "../store/interfaces";

// Main login flow for Crypto.com DeFi Wallet with Wallet Extension
// The connector must be activated, then it exposes a provider
// that is used by the ethers Web3Provider constructor.
export const connect = async (): Promise<IWallet> => {
  try {
    const connector = new DeFiWeb3Connector({
      supportedChainIds: [config.configVars.rpcNetwork.chainId],
      rpc: {
        [config.configVars.rpcNetwork.chainId]:
          config.configVars.rpcNetwork.rpcUrl,
      },
      pollingInterval: 15000,
    });
    await connector.activate();
    const provider = await connector.getProvider();
    const web3Provider = new ethers.providers.Web3Provider(provider);
    if (
      !(parseInt(provider.chainId) === config.configVars.rpcNetwork.chainId)
    ) {
      window.alert(
        "Switch your Wallet to blockchain network " +
          config.configVars.rpcNetwork.chainName
      );
      return defaultWallet;
    }
    // Subscribe to events that reload the app
    connector.on("session_update", utils.reloadApp);
    connector.on("Web3ReactDeactivate", utils.reloadApp);
    connector.on("Web3ReactUpdate", utils.reloadApp);

    return {
      ...defaultWallet,
      walletProviderName: "defiwallet",
      address: (await web3Provider.listAccounts())[0],
      browserWeb3Provider: web3Provider,
      serverWeb3Provider: new ethers.providers.JsonRpcProvider(
        config.configVars.rpcNetwork.rpcUrl
      ),
      wcProvider: provider,
      wcConnector: connector,
      connected: true,
      chainId: provider.chainId,
    };
  } catch (e) {
    window.alert(e);
    return defaultWallet;
  }
};
