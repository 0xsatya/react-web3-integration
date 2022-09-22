import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import ERC1155SCJson from "../abis/ERC1155SmartContract.json";
import { ethers } from "ethers";

const Mint = () => {
  const [signer, setSigner] = useState();
  // const [nftAddress, setNftAddress] = useState("0xa56C5fE1C6D94c6f1257d02B437A56F2F15c1511");
  const [nftAddress, setNftAddress] = useState("0x6d71A881a8C81be9D381431D0B9b737F26598406");
  const [tokenId, setTokenId] = useState();
  const [priceInDollar, setPriceInDollar] = useState();

  //NOTE: added pricing
  const [amount, setAmount] = useState(0.01);
  const [price, setPrice] = useState(0.01);
  const [newPrice, setNewPrice] = useState(price);
  const connectMetamask = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer1 = provider.getSigner();
    setSigner(signer1);
    return signer1;
  };

  const getContract = async () => {
    let signer1;
    if (!signer) {
      signer1 = await connectMetamask();
    } else signer1 = signer;

    return new ethers.Contract(nftAddress, ERC1155SCJson.abi, signer1);
  };

  const mintNft = async () => {
    // nftAddress in ropstein = 0xa56C5fE1C6D94c6f1257d02B437A56F2F15c1511
    console.log("Minting NFT ...");
    if (!nftAddress) {
      alert("pls enter nft address");
      return false;
    }
    //TODO: don't use connectMetamask() in production. Use walletConnect component
    let signer1;
    if (!signer) {
      signer1 = await connectMetamask();
    } else signer1 = signer;

    console.log("Deploying SC ...", signer1);
    let nftContract = new ethers.Contract(nftAddress, ERC1155SCJson.abi, signer1);
    let receipientAddress = await signer1.getAddress();
    console.log("Nft receipient :", receipientAddress);

    //NOTE: added pricing
    let args = [receipientAddress, { value: ethers.utils.parseEther(amount.toString()) }];

    console.log("Minting a NFT..");
    try {
      let txn = await nftContract.mint(...args);
      let txnResult = await txn.wait();
      console.log("Nft minted successful :");
      console.log("Check the minting at :", "https://ropsten.etherscan.io/token/" + nftAddress);
      console.log("Nft Txn details :", txnResult);
      let tokenId;
      const events = txnResult.events;
      events.forEach((event) => {
        if (event && event.event && event.event === "TransferSingle") {
          tokenId = Number(event.args[3]);
        }
      });
      console.log("Nft token Id minted :", tokenId);
      setTokenId(tokenId);
    } catch (err) {
      // console.log("Error while minting :", err);
      console.log("Message :", err.data.message?.split(":")[1]);
    }
  };

  const withdraw = async () => {
    // nftAddress in ropstein = 0xa56C5fE1C6D94c6f1257d02B437A56F2F15c1511
    console.log("Minting NFT ...");
    if (!nftAddress) {
      alert("pls enter nft address");
      return false;
    }
    //TODO: don't use connectMetamask() in production. Use walletConnect component
    let signer1;
    if (!signer) {
      signer1 = await connectMetamask();
    } else signer1 = signer;

    console.log("Deploying SC ...", signer1);
    let nftContract = new ethers.Contract(nftAddress, ERC1155SCJson.abi, signer1);
    let receipientAddress = await signer1.getAddress();
    console.log("Nft receipient :", receipientAddress);

    //NOTE: added pricing
    let args = [receipientAddress, { value: ethers.utils.parseEther(amount.toString()) }];

    console.log("withdrawing funds..");
    try {
      let txn = await nftContract.withdrawFunds();
      let txnResult = await txn.wait();

      console.log("withdraw funds done...", txnResult);
    } catch (err) {
      // console.log("Error while minting :", err);
      console.log("Message :", err.data.message?.split(":")[1]);
    }
  };

  const setNftPrice = async () => {
    // nftAddress in ropstein = 0xa56C5fE1C6D94c6f1257d02B437A56F2F15c1511
    console.log("setting new price ...");
    if (!nftAddress) {
      alert("pls enter nft address");
      return false;
    }
    //TODO: don't use connectMetamask() in production. Use walletConnect component

    let nftContract = await getContract();

    //NOTE: added pricing
    let args = [ethers.utils.parseEther(newPrice.toString())];

    try {
      let txn = await nftContract.setPrice(...args);
      let txnResult = await txn.wait();
      setPrice(newPrice);
      console.log("set price done..", txnResult);
    } catch (err) {
      console.log("Error while stting price:", err);
      console.log("Message :", err.data.message?.split(":")[1]);
    }
  };

  const getContractNftPrice = async () => {
    let nftContract = await getContract();
    const nftPrice = ethers.utils.formatEther(await nftContract.price());
    console.log("nft Price :", nftPrice);
    return nftPrice;
  };

  const getEthPriceInDollars = async (ethAmount) => {
    return Number(ethAmount) * 1738.68;
  };
  const getMaticPriceInDollars = async (maticAmount) => {
    return Number(maticAmount) * 0.93;
  };

  useEffect(() => {
    const init = async () => {
      let nftPrice = await getContractNftPrice();
      setPrice(nftPrice);
      setPriceInDollar(await getEthPriceInDollars(nftPrice));
    };
    init();
  }, []);

  return (
    <div className="container">
      <p>
        <span>Mint NFT:</span>
      </p>
      <input
        type="text"
        placeholder="nft address"
        size="40"
        value={nftAddress}
        onChange={(e) => setNftAddress(e.target.value)}
      />

      <Button variant="primary" name="Mint NFt" value={"Mint Nft"} onClick={mintNft}>
        Mint Nft
      </Button>

      <input
        type="text"
        placeholder="nft price in ethers"
        size="20"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <Button variant="primary" name="withdraw" value={"Withdraw"} onClick={withdraw}>
        withdraw
      </Button>

      <p>
        <input
          type="text"
          placeholder="nft price in ethers"
          size="20"
          value={newPrice}
          onChange={(e) => setNewPrice(e.target.value)}
        />
        <span> current price : {price} </span>
      </p>
      <p>
        <span> NFt price in dollars - ${priceInDollar} </span>
      </p>
      <Button variant="primary" name="setPrice" value={"SetPrice"} onClick={setNftPrice}>
        set nft price
      </Button>

      <p>{tokenId && <span>TokenId:{tokenId}</span>}</p>
    </div>
  );
};

export default Mint;
