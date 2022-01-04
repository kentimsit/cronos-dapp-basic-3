import {
  Dispatch,
  IQueryResults,
  IRefreshing,
  IWallet,
  IWalletWeb3Modal,
} from "./interfaces";

// Send an action to the reducer

export const updateRefreshingAction = (
  dispatch: Dispatch,
  refreshing: IRefreshing
) => {
  return dispatch({
    type: "REFRESHING_UPDATED",
    payload: refreshing,
  });
};

export const updateWalletAction = (dispatch: Dispatch, wallet: IWallet) => {
  return dispatch({
    type: "WALLET_UPDATED",
    payload: wallet,
  });
};

export const updateWalletWeb3ModalAction = (
  dispatch: Dispatch,
  walletWeb3Modal: IWalletWeb3Modal
) => {
  return dispatch({
    type: "WALLETWEB3MODAL_UPDATED",
    payload: walletWeb3Modal,
  });
};

export const updateQueryResultsAction = (
  dispatch: Dispatch,
  queryResults: IQueryResults
) => {
  return dispatch({
    type: "QUERYRESULTS_UPDATED",
    payload: queryResults,
  });
};
