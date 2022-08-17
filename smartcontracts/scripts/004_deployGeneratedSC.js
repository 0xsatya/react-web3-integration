// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { ethers } = require("hardhat");

let unrevealedURI = "https://gateway.pinata.cloud/ipfs/welcome.json";
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
  const NFTContract = await ethers.getContractFactory('ERC1155GeneratedSmartContract')
  //deploy nft
  nftDeployed = await NFTContract.deploy(
    "GeneratedSC", "GSC", 500, baseURI, false, unrevealedURI);

  await nftDeployed.deployed();
  console.log('NFT Contract deployed to address:', nftDeployed.address)
  console.log("NTF owner: ", await nftDeployed.owner());
 
  console.log(`Command to verify SC: $ npx hardhat verify --network mumbai ${nftDeployed.address} TieredSC TSC 500  "https://gateway.pinata.cloud/ipfs/" [10, 90, 400]`);
  //set baseURI of the nft
  //   let baseURI1 = await nftDeployed.getBaseURI();
    console.log("unrevealed URI is - ", await nftDeployed.uri(0));

    await mintNft();
    console.log("nft URI before revealed - ", await nftDeployed.uri(0));

    //reveal nfts
    await nftDeployed.setRevealed();
    console.log("nft URI after revealed - ", await nftDeployed.uri(0));

}

async function mintNft() {
  let tx = await nftDeployed.mint(
    accts[0].address, 
    { gasLimit: 300000});
  const receipt = await tx.wait();
  let tokenId;
  for (const event of receipt.events) {
    if (event.event !== 'TransferSingle') {
      console.log('ignoring unknown event type ', event.event)
      continue
    }
    tokenId = Number(event.args[3])
    // console.log("TokenId fetched - ",Number(event.args[3]), tokenId);
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
