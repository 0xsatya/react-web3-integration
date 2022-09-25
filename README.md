# TROUBLE SHOOTING

## HOw to get realtime MATIC/ETH vs USD price
1. Use getEthPriceInDollars | getMaticPriceInDollars functions at src => MintComponent => Mint.jsx;

## How to resolve "insufficient funds for intrinsic transaction cost" ERROR
1. Check deployment function at src => script => deployNft.js)
2. Check chainstackNodeUrl is correct for Mainnet ( different from that of testnet)
3. Check gasPrice and gasLimit is passed as args while calling deploy.

## Whats new ##

## To enable price of nft
1. Replace abis from smartcontracts/artifacts/contracts to src/abis folder.
2. deploy SC passing nft price as one of the argument.
3. Price can be reset by calling setPrice function by owner at any time.
4. while minting user has to send nft price + gas fees.
5. while minting multiple nfts, amount sent = nft Price * nft count.


## To compile SC
1. cd smartcontracts
2. $ yarn compile
3. copy the abis from artifacts/contracts folder to src/abis

