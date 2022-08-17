// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { ethers } = require("hardhat");

let nftDeployed, accts;
async function main() {

  //baseURI and not revealed uri
  let baseURI = "https://gateway.pinata.cloud/ipfs/";
  
  // We get the contract to deploy
  accts = await ethers.getSigners();
  // accts.forEach( acct => {
  //   console.log('Account address: ', acct.address);
  // })
  console.log('Deployer address :', accts[0].address);

  //Get NFTContract
  const NFTContract = await ethers.getContractFactory('ERC1155TieredSmartContract')
  //deploy nft
  nftDeployed = await NFTContract.deploy(
    "TieredSC", "TSC", 500, baseURI, [10, 90, 400]);

  await nftDeployed.deployed();
  console.log('NFT Contract deployed to address:', nftDeployed.address)
  console.log("NTF owner: ", await nftDeployed.owner());
 
  console.log(`Command to verify SC: $ npx hardhat verify --network mumbai ${nftDeployed.address} TieredSC TSC 500  "https://gateway.pinata.cloud/ipfs/" [10, 90, 400]`);
  //set baseURI of the nft
  let baseURI1 = await nftDeployed.getBaseURI();
  console.log("baseURI set to - ", baseURI1);

  await mintNft();
}

async function mintNft() {
  let tx = await nftDeployed.mintTierTokens(
    accts[0].address, 1, 20,
    { gasLimit: 300000});
  const receipt = await tx.wait();
  let tokenId;
  for (const event of receipt.events) {
    if (event.event !== 'TransferSingle') {
      console.log('ignoring unknown event type ', event.event)
      continue
    }
    tokenId = Number(event.args[3])
    console.log("TokenId fetched - ",event.args, Number(event.args[3]), tokenId);
  }
  console.log('1 - tokenURI of tokenID: ', tokenId, await nftDeployed.uri(tokenId)); 
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
