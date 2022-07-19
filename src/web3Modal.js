import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { Web3Provider } from "@ethersproject/providers";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { Button } from "react-bootstrap";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import Fortmatic from "fortmatic";
// import Fortmatic from "fortmatic";

const INFURA_ID = "f141a32a386146f9a433d17ad5093449";
const FORTMATIC_KEY = "pk_test_AB69A416CD105634";
const providerOptions = {
  walletconnect: {
    display: {
      name: "Mobile",
    },
    package: WalletConnectProvider,
    options: {
      infuraId: INFURA_ID, // required
    },
  },
  coinbasewallet: {
    package: CoinbaseWalletSDK, // Required
    options: {
      appName: "My Awesome App", // Required
      infuraId: INFURA_ID, // Required
      rpc: "", // Optional if `infuraId` is provided; otherwise it's required
      //   chainId: 1, // Optional. It defaults to 1 if not provided
      darkMode: false, // Optional. Use dark theme, defaults to false
    },
  },
  fortmatic: {
    package: Fortmatic, // required
    options: {
      key: FORTMATIC_KEY, // required
      network: {
        rpcUrl: "https://rpc-mainnet.maticvigil.com",
        chainId: 137,
      }, // if we don't pass it, it will default to localhost:8454
    },
  },
};

export const web3Modal = new Web3Modal({
  // network: "mainnet", // optional
  cacheProvider: true, // optional
  providerOptions, // required
});
