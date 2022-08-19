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