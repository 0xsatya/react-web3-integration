// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { ethers, ContractFactory } = require("ethers");
// const { getNodeUrl } = require("./utils");
const SMART_CONTRACT_1155 = require("./../abis/ERC1155SmartContract.json");

// Polygon testnet Url
const chainStackWssNodeUrl = "wss://ws-nd-339-253-764.p2pify.com/7bedd18da77a42fe744b83d1f2461e4e";
const chainStackHttpsNodeUrl = "https://nd-339-253-764.p2pify.com/7bedd18da77a42fe744b83d1f2461e4e";

// Polygon Mainnet Node Url
// const infuraHttpsNodeUrl = "https://polygon-mainnet.infura.io/v3/d6851b2af1554a7f908cbecb7212e050";

let nftDeployed, accts;

const input = {
  pubKey: "0x1e5Cf54aF5D60d863926a8839f24db29376CA678",
  pvtKey: "fb18ec08cb424829a1106eb5ac390ff44b672da923d134ea756a143524d0ec18",
  name: "test",
  symbol: "TST",
  maxSupply: 1000,
  blockchain: "polygon testnet",
  tokenURI: "https://shipnfts.io/tokenId/",
};

async function main() {
  const pubKey = input.pubKey;
  const pvtKey = input.pvtKey;

  const name = input.name;
  const symbol = input.symbol;
  const totalCount = input.maxSupply;
  const blockchain = input.blockchain;
  const tokenURI = input.tokenURI ? input.tokenURI : "https://shipnfts.io/tokenId/";

  const contractJsonData = SMART_CONTRACT_1155;
  console.log("Print contract name :", contractJsonData.contractName);

  // TODO: use the string in env file
  // const nodeUrl = getNodeUrl(blockchain, this.env.get("STAGE"), "");
  // console.log("NOdeurl-->", nodeUrl);
  // const provider = new ethers.providers.WebSocketProvider(chainStackWssNodeUrl);
  const provider = new ethers.providers.JsonRpcProvider(chainStackHttpsNodeUrl);
  // const provider = new ethers.providers.JsonRpcProvider(infuraHttpsNodeUrl);

  const wallet = new ethers.Wallet(pvtKey);
  const account = wallet.connect(provider);

  console.log("deploying contract...");
  const deployArgs = [name, symbol, totalCount, tokenURI, ethers.utils.parseEther("0.1"), pubKey];

  const contractFactory = new ContractFactory(contractJsonData.abi, contractJsonData.bytecode, account);
  const nftContract = await contractFactory.deploy(...deployArgs, {
    gasPrice: ethers.utils.parseUnits("50", "gwei"),
    gasLimit: 5000000,
  });

  await nftContract.deployed();
  console.log("Deployed contract address :", nftContract.address);
}

async function mintNft() {
  let tx = await nftDeployed.mintTierTokens(accts[0].address, 1, 20, { gasLimit: 300000 });
  const receipt = await tx.wait();
  let tokenId;
  for (const event of receipt.events) {
    if (event.event !== "TransferSingle") {
      console.log("ignoring unknown event type ", event.event);
      continue;
    }
    tokenId = Number(event.args[3]);
    console.log("TokenId fetched - ", event.args, Number(event.args[3]), tokenId);
  }
  console.log("1 - tokenURI of tokenID: ", tokenId, await nftDeployed.uri(tokenId));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
