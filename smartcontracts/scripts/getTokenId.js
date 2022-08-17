// import { ethers } from "ethers";
const { ethers } = require("ethers");
const chainStackNodeUrl = "wss://mainnet.infura.io/ws/v3/d6851b2af1554a7f908cbecb7212e050"; //infura
// const chainStackNodeUrl = "wss://ws-nd-408-541-804.p2pify.com/84fe3873a340b6d6654023b6e4426ccd"; // chainstack

async function getTokenIdfromTxHash(transactionHash) {
  console.log("getting txn :", transactionHash);

  const provider = new ethers.providers.WebSocketProvider(chainStackNodeUrl);
  // const provider = new ethers.providers.Web3Provider(chainStackNodeUrl);
  // const wallet = new ethers.Wallet(pvtKey);
  // const account = wallet.connect(provider);

  const txReceipt = await provider.getTransactionReceipt(transactionHash);
  // console.log("getTokenIdfromTxHash ~ txReceipt", txReceipt);
  const topics = txReceipt.logs[0].topics;
  const data = txReceipt.logs[0].data;
  // console.log("getTokenIdfromTxHash ~ topics", topics);
  // console.log("getTokenIdfromTxHash ~ data", data);
  if (txReceipt) {
    const tokenIdStr = data.substring(2, 66);
    console.log("🚀 => getTokenIdfromTxHash => tokenIdStr", tokenIdStr);
    const tokenId = parseInt(tokenIdStr, 16);
    console.log("getTokenIdfromTxHash ~ tokenId", tokenId);
    return tokenId;
  } else {
    return -1;
  }
}

// export default { getTokenIdfromTxHash };

async function main() {
  console.log("hello :");
  // await getTokenIdfromTxHash("0x1327b06de9b05a4cfae62a324214a5591354fe2493a401fc18de89fd02b13f76"); //mumbai
  // await getTokenIdfromTxHash("0x8025e22ea1a92851efb27f9099879ef5e5f6d10626274f4adfd65152abffa6ba"); //mainnet
  await getTokenIdfromTxHash("0x79d5dd71712f7640df31e5f010b8a456ef9340fd76cae709722d6a67df00b077"); //mainnet
  //https://etherscan.io/tx/0x79d5dd71712f7640df31e5f010b8a456ef9340fd76cae709722d6a67df00b077
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
