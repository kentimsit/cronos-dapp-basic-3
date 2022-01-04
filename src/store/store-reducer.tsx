import React from "react";
import {
  defaultQueryResults,
  defaultRefreshing,
  defaultWallet,
  defaultWalletWeb3Modal,
  IAction,
  IState,
} from "./interfaces";

const initialState: IState = {
  refreshing: defaultRefreshing,
  wallet: defaultWallet,
  walletWeb3Modal: defaultWalletWeb3Modal,
  queryResults: defaultQueryResults,
};

export const Store = React.createContext<IState | any>(initialState);

// The reducer takes the state and applies the action(s) to it in order to modify the store
// Each action has a type and payload
function reducer(state: IState, action: IAction): IState {
  switch (action.type) {
    case "REFRESHING_UPDATED":
      return { ...state, refreshing: action.payload };
    case "WALLET_UPDATED":
      return { ...state, wallet: action.payload };
    case "WALLETWEB3MODAL_UPDATED":
      return { ...state, walletWeb3Modal: action.payload };
    case "QUERYRESULTS_UPDATED":
      return { ...state, queryResults: action.payload };
    default:
      return state;
  }
}

// This is used to inject the Store at the top level in the index.tsx file
export function StoreProvider(props: any): JSX.Element {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  return (
    <Store.Provider value={{ state, dispatch }}>
      {props.children}
    </Store.Provider>
  );
}
