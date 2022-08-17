const { expect, assert } = require("chai");
const { deployContract } = require("ethereum-waffle");
const { ethers, deployments } = require("hardhat");
const { waffle } = require("hardhat");

const provider = waffle.provider;
//require('hardhat/console');

let scInstance, instance, NFTInstance, nftInstance, currentPasuseStatus;

// let gasLimit = 100000;
const imgBaseURL = "https://gateway.pinata.cloud/ipfs/"; // 1.png, 2.png

let param_totalSupply = 10000;
const param_price = 0.12; // * 10 ** 18;
const param_rareprice = 0.12; // * 10 ** 18;
let param_maxMintAllowedOnce = 25;

const ownerAddress = '0xda210a5DF6985380DeE4990C914744e54E771Ad6';
const nftName = "MyNFTOriginal";
const nftSymbol = "MNO" ;
const maxBatchSize = "10";
const tokenMaxCounts = [10, 90, 400];
param_maxMintAllowedOnce = maxBatchSize;

const collectionSize = 5000;
param_totalSupply = collectionSize;

// const contractAddress = "0x20c2905297D4Cd567ED4a70AAF45473d0bcD3d78";

const baseURI = "https://gateway.pinata.cloud/ipfs/"; //QmYJfBnWNVjYR2gayhRZucjScnTg1D9h6wqpPotr2qd7N4";
let owner, acct1, acct2, acct3;

before(async function () {

  //----------------Rinkeby Testing---------------------------/
  // [owner, account1] = await ethers.getSigners();
  // let signer = provider.getSigner();
  // console.log("Singner Address: ", await signer.getAddress());
  // NFTInstance = await deployments.getArtifact("DaBunny");
  // //let owner = await nftInstance.owner();
  // console.log("Contract Name: ", NFTInstance.contractName);
  // console.log("Get Singners Acc 1: ", owner.address);
  // console.log("Get Singners Acc 2: ", account1.address);
  // nftInstance = new ethers.Contract(contractAddress, NFTInstance.abi, signer);
  // console.log("NFT instance address: ", nftInstance.address);
  // let ownerAdd = await nftInstance.owner();
  // // const nftDeployer = await ethers.getSigners();
  // console.log("Present Owner Address: ", ownerAdd);

  //-----------------------Local Testing-----------------------------/
  [owner, acct1, acct2, acct3, acct4] = await ethers.getSigners();
//   scInstance = await ethers.getContractFactory("ERC1155TieredSmartContract");
//   instance = await scInstance.deploy(owner.address, acct1.address, acct2.address);
//   await instance.deployed();
  
  NFTInstance = await ethers.getContractFactory("ERC1155TieredSmartContract");
  nftInstance = await NFTInstance.deploy(nftName, nftSymbol, maxBatchSize, collectionSize);
  await nftInstance.deployed();

  let ownerAddress = await nftInstance.owner();
  console.log('Contract owner address is :', ownerAddress);
  console.log('contract address is :', nftInstance.address);  
    expect(ownerAddress).to.equal(owner.address);

  //set baseURI of the nft
  let baseURI1 = await nftInstance.getBaseURI();
  console.log("NFT baseURI set to - ", baseURI1);

});

//check whether the contract has a valid address
describe("NFT - Checking default parameters", function () {
  it("Contract is successfully deployed", async () => {
    assert.notEqual(nftInstance.address, "", "Contract has a address");
    assert.notEqual(nftInstance.address, 0x0, "Contract has a address");
    assert.notEqual(nftInstance.address, null, "Contract has a address");
    assert.notEqual(nftInstance.address, undefined, "Contract has a address");
  });

  it("Maximum Supply is set correctly", async () => {
    let totalSupply = await nftInstance.maxSupply();
    assert.equal(totalSupply.toString(), collectionSize, "Total supply not set correctly");
  });


  // it("NFT price is set correctly", async () => {
  //   let getBunnyPrice = await nftInstance.price();
  //   assert.equal(ethers.utils.formatEther(getBunnyPrice.toString()),"0.12",
  //     "NFT price is 0.12 ether");
    
  //   await nftInstance.setPrice(ethers.utils.parseEther('0.08'));
  //   let getBunnyPrice1 = await nftInstance.price();
  //   console.log('getBunnyPrice1 :', getBunnyPrice1.toString(), ethers.utils.formatEther(getBunnyPrice1));
  //   assert.equal(Number(ethers.utils.formatEther(getBunnyPrice1)), 0.08,
  //     "NFT price is not 0.08 ether");
  // });



  it("Base URI is set/get correctly", async () => {
    let tx = await nftInstance.uri();
    await tx.wait();

    let tx1 = await nftInstance.setURI(baseURI);
    await tx1.wait();

    let baseURI1 = await nftInstance.uri();
    assert.equal(
      baseURI1, baseURI, "Base URI is not set correctly"
    );
  });

  it("Check owner is the contract creator", async () => {
    let ownerAdd = await nftInstance.owner();
    assert.equal(ownerAdd, owner.address, "Owner is the contract creator");
  });

});

// describe("NFT Contract - Setting parameters", function () {
//   it("Changing current Supply", async () => {
//     let ownerAdd = await nftInstance.owner();
//     console.log(ownerAdd);
//     let tx = await nftInstance.setCurrentSupply("2000");
//     await tx.wait();

//     let currentSupply = await nftInstance.currentSupply();
//     //console.log(totalSupply.toString());
//     assert.equal(
//       currentSupply.toString(),
//       "2000",
//       "Current supply not changed to 2000"
//     );
//   });

// });

describe("NFT - Minting Tokens", function () {
  it("Mint single token", async () => {
    await nftInstance.connect(owner).mintTierTokens( acct1.address, 1, 10, {
      gasLimit: gasLimit * 20,
    });

    let totalMintedTokens = await nftInstance.totalSupply();
    //console.log(totalSupply.toString());
    assert.equal(
      totalMintedTokens.toString(),
      "1",
      "Total minted tokens not correct"
    );
    expect(await nftInstance.balanceOf(owner.address)).to.equal(1);
  });

  it("Mint multiple token", async () => {
    await nftInstance.connect(owner).mintTierTokens(9, {
      value: ethers.utils.parseUnits( (1.08).toString(), "ether")
      // gasLimit: gasLimit * 3,
    });
    let totalMintedTokens = await nftInstance.totalSupply();
    assert.equal(
      totalMintedTokens.toString(),
      "10",
      "Total minted tokens not correct"
    ); 
    expect(await nftInstance.balanceOf(owner.address)).to.equal(10);

  });
});


