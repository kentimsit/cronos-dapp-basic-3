import * as React from "react";

import { styled, alpha } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Menu, { MenuProps } from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import RocketIcon from "@mui/icons-material/Rocket";

import { Store } from "../store/store-reducer";
import * as utils from "../helpers/utils";

// These are the wallet SDK helpers
import * as walletMetamask from "../helpers/wallet-metamask";
import * as walletDefiwallet from "../helpers/wallet-defiwallet";
import * as walletConnect from "../helpers/wallet-connect";

import {
  updateQueryResultsAction,
  updateRefreshingAction,
  updateWalletAction,
} from "../store/actions";
import { defaultQueryResults, defaultWallet } from "../store/interfaces";

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

declare global {
  interface Window {
    ethereum: any;
  }
}

interface IProps {}

const Header: React.FC<IProps> = () => {
  const { state, dispatch } = React.useContext(Store);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // Uncomment this to auto-connect in MetaMask in-app browser
  // React.useEffect(() => {
  //   async function initialLoad() {
  //     activate(injectedConnector);
  //   }
  //   initialLoad();
  // }, []);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickConnect = async (option: string) => {
    updateRefreshingAction(dispatch, {
      status: true,
      message: "Connecting wallet...",
    });
    let newWallet: any;
    switch (option) {
      // Wallet injected within browser (MetaMask)
      case "metamask-injected":
        newWallet = await walletMetamask.connect();
        break;
      // Crypto.com DeFi Wallet Extension (browser)
      case "defiwallet":
        newWallet = await walletDefiwallet.connect();
        break;
      // Crypto.com DeFi Wallet mobile app (via Wallet Connect)
      case "wallet-connect":
        newWallet = await walletConnect.connect();
        break;
      default:
        newWallet = await walletMetamask.connect();
    }
    // If wallet is connected, query the blockchain and update stored values
    if (newWallet.connected) {
      const lastBlockNumber = await utils.getLastBlockNumber(
        newWallet.serverWeb3Provider
      );
      const croBalance = await utils.getCroBalance(
        newWallet.serverWeb3Provider,
        newWallet.address
      );
      const erc20Balance = await utils.getBalance(
        newWallet.serverWeb3Provider,
        newWallet.address
      );
      updateWalletAction(dispatch, newWallet);
      updateQueryResultsAction(dispatch, {
        ...defaultQueryResults,
        lastBlockNumber: lastBlockNumber,
        croBalance: croBalance,
        erc20Balance: erc20Balance,
      });
    }
    updateRefreshingAction(dispatch, {
      status: false,
      message: "Complete",
    });
    handleClose();
  };

  // Disconnect wallet clears the data stored by the front-end app
  // Some wallets can be asked to actually disconnect from the app, but most cannot.
  // The recommended secure approach is for the user to disconnect their wallet
  // themselves in the wallet app or browser extension.
  const disconnectWallet = async () => {
    updateRefreshingAction(dispatch, {
      status: true,
      message: "Disconnecting wallet...",
    });
    switch (state.wallet.walletProviderName) {
      case "defiwallet":
        await state.wallet.wcConnector.deactivate();
        break;
      default:
    }
    updateRefreshingAction(dispatch, {
      status: false,
      message: "Complete",
    });
    updateWalletAction(dispatch, { ...defaultWallet });
    updateQueryResultsAction(dispatch, { ...defaultQueryResults });
  };

  const renderLoginButton = () => {
    if (state.wallet.connected) {
      return (
        <Button color="inherit" onClick={disconnectWallet}>
          Disconnect
        </Button>
      );
    } else {
      return (
        <div>
          <Button
            id="demo-customized-button"
            aria-controls="demo-customized-menu"
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            variant="contained"
            disableElevation
            onClick={handleClick}
            endIcon={<KeyboardArrowDownIcon />}
          >
            Connect Wallet
          </Button>
          <StyledMenu
            id="demo-customized-menu"
            MenuListProps={{
              "aria-labelledby": "demo-customized-button",
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
            <MenuItem
              onClick={() => {
                handleClickConnect("metamask-injected");
              }}
              disableRipple
            >
              MetaMask (browser / mobile)
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleClickConnect("defiwallet");
              }}
              disableRipple
            >
              Crypto.com Wallet Extension (browser)
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleClickConnect("wallet-connect");
              }}
              disableRipple
            >
              Wallet Connect (browser / mobile)
            </MenuItem>
          </StyledMenu>
        </div>
      );
    }
  };

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              sx={{ mr: 2 }}
            >
              <RocketIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              My Dapp
            </Typography>
            {renderLoginButton()}
          </Toolbar>
        </AppBar>
      </Box>
    </div>
  );
};

export default Header;
