import React, { useState } from "react";
import { Button } from "react-bootstrap";
import ERC1155SCJson from "../abis/ERC1155SmartContract.json";
import { ethers } from "ethers";
function Deploy() {
  const [signer, setSigner] = useState();
  const [nftAddress, setNftAddress] = useState();

  const connectMetamask = async () => {
    console.log("Connecting to metamask...");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer1 = provider.getSigner();
    console.log("🚀 ~ signer1", signer1);
    // web3Modal.clearCachedProvider();
    // const instance = await web3Modal.connect();
    // const web3Prov = new ethers.providers.Web3Provider(instance);
    // const signer1 = web3Prov.getSigner();
    setSigner(signer1);
    return signer1;
  };

  const deploySmartcontract = async () => {
    //TODO: don't use connectMetamask() in production. Use walletConnect component
    let signer1;
    if (!signer) {
      signer1 = await connectMetamask();
    } else signer1 = signer;

    console.log("Deploying SC ...", signer1);

    // TODO: use signer from the WallectConnect component.
    let nftInstance = new ethers.ContractFactory(ERC1155SCJson.abi, ERC1155SCJson.bytecode, signer1);

    //TODO: following is parameter for the ERC1155Smartcontract. for Tiered and Generated SC, use
    // respective args in the order
    let args = ["MyShipNft", "MSN", 1000, "https://myshipnft.com"];

    const nftContract = await nftInstance.deploy(...args);
    console.log("nftContract deploying to address... :", nftContract.address);
    await nftContract.deployed();
    console.log("nftContract deployed succesfuly to address :", nftContract.address);
    setNftAddress(nftContract.address);
  };

  return (
    <div className="container">
      <p>
        <span>Select a Smartcontract to Deploy:</span>
      </p>
      <Button variant="primary" name="Deploy SC" value={"Deploy SC"} onClick={deploySmartcontract}>
        Deploy SC
      </Button>
      <p>{nftAddress && <span>nft deployed to address: {nftAddress}</span>}</p>
    </div>
  );
}

export default Deploy;
