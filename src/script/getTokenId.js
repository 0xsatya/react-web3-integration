import { ethers } from "ethers";

async function getTokenIdfromTxHash(transactionHash) {
  console.log("called :");
  const txReceipt = await ethers.provider.getTransactionReceipt(transactionHash);
  console.log("getTokenIdfromTxHash ~ txReceipt", txReceipt);
  const topics = txReceipt.logs[0].topics;
  console.log("getTokenIdfromTxHash ~ topics", topics);
  if (txReceipt) {
    const accountAdd = `0x${Buffer.from(ethers.utils.stripZeros(topics[2])).toString("hex")}`;
    const tokenId = parseInt(topics[3], 16);
    console.log("getTokenIdfromTxHash ~ accountAdd", accountAdd);
    console.log("getTokenIdfromTxHash ~ tokenId", tokenId);
    return accountAdd, tokenId;
  } else {
    return -1;
  }
}

// export default { getTokenIdfromTxHash };

function main() {
  console.log("hello :");
  // getTokenIdfromTxHash("0x50d6e7b01f488759498c1a8d67f3964f29a1869727c7981c0d71388ebc4e9d5a");
}

main();
