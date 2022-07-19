import React, { useEffect, useState } from "react";
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

function WalletConnect() {
  const [custodianWallet, setCustodianWallet] = useState("0x22Bf1A3B91fBD2D999C85E7873bd62B2390A7621");
  const [personalWallet, setPersonalWallet] = useState("");
  const [custodianWalletBalance, setCustodianWalletBalance] = useState(0);
  const [personalWalletBalance, setPersonalWalletBalance] = useState(0);
  const [transferAmount, setTransferAmount] = useState(0.1);
  const [provider, setProvider] = useState();
  const [signer, setSigner] = useState();
  const [networkData, setNetworkData] = useState({});
  const [txnStatus, setTxnStatus] = useState("");

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

  const web3Modal = new Web3Modal({
    // network: "mainnet", // optional
    cacheProvider: true, // optional
    providerOptions, // required
  });

  const connectWallet = async () => {
    console.log("Connecting wallet..");
    web3Modal.clearCachedProvider();
    createWalletInstance();
  };

  const createWalletInstance = async () => {
    const instance = await web3Modal.connect();

    const web3Prov = new ethers.providers.Web3Provider(instance);
    // const web3Prov = new Web3Provider(provider1);
    const signer1 = web3Prov.getSigner();

    setProvider(web3Prov);
    setSigner(signer1);
    if (web3Prov) {
      let add = await signer1.getAddress();
      let bal = Number(ethers.utils.formatEther(await signer1.getBalance())).toString();
      let networkData = await web3Prov.getNetwork();
      console.log("add, bal, networkData :", add, bal, networkData);
      setPersonalWallet(add);
      setPersonalWalletBalance(bal);
      setNetworkData(networkData);
      let cWallBal = ethers.utils.formatEther(await web3Prov.getBalance(custodianWallet));
      console.log("custodian wallet balance :", cWallBal);
      setCustodianWalletBalance(cWallBal);
    }
  };
  const transferFunds = async () => {
    try {
      console.log("Transfer wallet, amount :", custodianWallet, transferAmount);
      let cWallBal = ethers.utils.formatEther(await provider.getBalance(custodianWallet));
      console.log("custodian wallet balance :", cWallBal);
      setCustodianWalletBalance(cWallBal);
      // Creating a transaction param
      let defaultAccount = personalWallet;
      const tx = {
        from: defaultAccount,
        to: custodianWallet,
        value: ethers.utils.parseEther(transferAmount.toString()),
        nonce: await provider.getTransactionCount(defaultAccount, "latest"),
        gasLimit: ethers.utils.hexlify(50000),
        gasPrice: ethers.utils.hexlify(parseInt(await provider.getGasPrice())),
      };
      setTxnStatus("adding funds...");
      let txn = await signer.sendTransaction(tx);
      // .then((transaction) => {
      //     console.dir(transaction);
      //     alert("Send finished!");
      // });
      await txn.wait();
      console.log("Funds sent successful :", txn);
      cWallBal = ethers.utils.formatEther(await provider.getBalance(custodianWallet));
      console.log("custodian wallet balance :", cWallBal);
      setCustodianWalletBalance(cWallBal);
      setTxnStatus("funds added successful");
    } catch (err) {
      console.log("Error occured :", err);
      setTxnStatus("Failed!! pls try again..");
    }
  };

  useEffect(() => {
    const init = async () => {
      //   let cWallBal = ethers.utils.formatEther(await provider.getBalance(custodianWallet));
      //   console.log('custodian wallet balance :', cWallBal);
      //   setCustodianWalletBalance(cWallBal);
      createWalletInstance();
    };
    init();
  }, []);

  return (
    <div>
      <div>Web3 connect wallet</div>
      {/* <Button variant="primary">Button #1</Button> */}
      <p>
        <Button variant="primary" name="connect wallet" onClick={connectWallet}>
          connectWallet
        </Button>
      </p>
      <div>
        <span>
          {personalWallet ? (
            <div>
              <p> Connect Wallet Id: {personalWallet}</p>
              <p> Wallet Balance: {personalWalletBalance} </p>
              <h4>
                {" "}
                chainId: {networkData.chainId} Name: {networkData.name}
              </h4>
              <p>-------------------------------</p>
              <p> Add funds to custodian wallet </p>
              Custodian Wallet ID:{" "}
              <input
                type="text"
                placeholder="wallet address"
                size="40"
                value={custodianWallet}
                onChange={(e) => setCustodianWallet(e.target.value)}
              />
              <h4> </h4>
              Funds to Add in ETH:{" "}
              <input
                type="text"
                placeholder="amount"
                size="5"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
              />
              <h4> </h4>
              <Button variant="primary" name="transfer funds" value={"Transfer Funds"} onClick={transferFunds}>
                Add Funds
              </Button>
              <h5>{txnStatus}</h5>
              <h4> Custodian Wallet Balance : {custodianWalletBalance} </h4>
            </div>
          ) : (
            <p>No wallet connected, pls connect first.</p>
          )}
        </span>
      </div>
    </div>
  );
}

export default WalletConnect;
