import { ContractFactory, ethers } from 'ethers';
import * as util from 'util';

import * as SMART_CONTRACT_1155_GENERATED from './abis/ERC1155GeneratedSmartContract.json';
import * as SMART_CONTRACT_1155 from './abis/ERC1155SmartContract.json';
import * as SMART_CONTRACT_1155_TIERED from './abis/ERC1155TieredSmartContract.json';
import * as SMART_CONTRACT from './abis/ERC721SmartContract.json';

import { getNodeUrl } from './utils';

const readFile = util.promisify(fs.readFile);
const chainStackNodeUrl =
  'wss://ws-nd-408-541-804.p2pify.com/84fe3873a340b6d6654023b6e4426ccd';


  //NOTE: Following functions are for creating ERC1155 Collection.
  async createERC1155Collection(input) {
    try {
      //parameters required....
      // const pubKey = '0xad6a8f3Cd111229661FD9dc54f6D52FC32fFeC0c'
      // const pvtKey =
      //   '13292266b65527c7665abc01ba929714bc59c4b9fe3d44f7c175449d1405ced9'

      const pubKey = input.pubKey;
      const pvtKey = input.pvtKey;

      const name = input.name;
      const symbol = input.symbol;
      const totalCount = input.maxSupply;
      const blockchain = input.blockchain;
      const tokenURI = input.tokenURI
        ? input.tokenURI
        : 'https://shipnfts.io/tokenId/';

      const contractJsonData = SMART_CONTRACT_1155;
      console.log('Print contract name :', contractJsonData.contractName);
      console.log('ContractJsonDataObject :', contractJsonData);

      //for changing the contract name.
      // let newContractName = 'MyNftContract';
      // contractJsonData["contractName"] = newContractName;
      // console.log('New Contract name :', contractJsonData.contractName);

      // TODO: use the string in env file
      const nodeUrl = getNodeUrl(blockchain, this.env.get('STAGE'), '');
      console.log('NOdeurl-->', nodeUrl);
      const provider = new ethers.providers.WebSocketProvider(nodeUrl.network);
      const wallet = new ethers.Wallet(pvtKey);
      const account = wallet.connect(provider);

      console.log('deploying contract...');
      const deployArgs = [name, symbol, totalCount, tokenURI];

      // console.log('logs :', name, symbol, totalCount, tokenURI);

      const contractFactory = new ContractFactory(
        contractJsonData.abi,
        contractJsonData.bytecode,
        account,
      );
      const nftContract = await contractFactory.deploy(...deployArgs, {
        gasPrice: ethers.utils.parseUnits('50', 'gwei'),
        gasLimit: 5000000,
      });
      await nftContract.deployed();

      //mint token if required, then the respective tokenURL will also be required.
      // let tx = await this.mintNFT({
      //   collectionAddress: nftContract.address,
      //   tokenOwner: account.address,
      //   tokenId: null,
      //   pubKey: account.address,
      //   pvtKey: pvtKey
      // });
      // console.log('TokenMinted status :', tx);
      //----------------------

      return {
        status: true,
        name: name,
        symbol: symbol,
        totalCount: totalCount,
        deployedAddress: nftContract.address,
        error: null,
      };
    } catch (err) {
      console.log('******* ERROR *********');
      console.log('ERROR occured:createERC721Collection:', err.message);
      return {
        status: false,
        error: err.message,
        name: null,
        symbol: null,
        totalCount: null,
      };
    }
  }

  async mintNFT1155(input) {
    //TODO: Its for testing, may removed in production.
    // const pubKey = '0xad6a8f3Cd111229661FD9dc54f6D52FC32fFeC0c'
    // const pvtKey =
    //   '13292266b65527c7665abc01ba929714bc59c4b9fe3d44f7c175449d1405ced9'
    const nodeUrl = getNodeUrl(input.blockchain, this.env.get('STAGE'), '');
    try {
      const pubKey = input.pubKey;
      const pvtKey = input.pvtKey;
      const totalCopies = input.totalCopies;
      const blockchain = input.blockchain;

      //get account and provider

      const provider = new ethers.providers.WebSocketProvider(nodeUrl.network);
      const wallet = new ethers.Wallet(pvtKey);
      const account = wallet.connect(provider);

      //get contract
      // const source = fs.readFileSync(
      //   resolve(__dirname, './abis/ERC721SmartContract.json'),
      //   'utf8',
      // )
      const contractJsonData = SMART_CONTRACT_1155;
      const nftContract = new ethers.Contract(
        input.collectionAddress,
        contractJsonData.abi,
        account,
      );

      //mint nft token
      const tx = await nftContract.mintWithClones(pubKey, totalCopies, {
        gasPrice: ethers.utils.parseUnits('50', 'gwei'),
        gasLimit: 2000000,
      });

      const txResult = await tx.wait();
      let tokenId: number;
      const events = txResult.events;
      events.forEach((event) => {
        if (event && event.event && event.event === 'TransferSingle') {
          tokenId = Number(event.args[3]);
        }
      });
      return {
        status: true,
        tokenId: tokenId,
        error: null,
      };
    } catch (err) {
      console.log('****** ERROR *******');
      return {
        status: false,
        error: err.message,
        hash: 'err.receipt.logs[0].transactionHash',
        errorLink: `${nodeUrl.base}tx/${err.receipt.logs[0].transactionHash}`,
      };
    }
  }

  async transferNFT1155(input) {
    //TODO: Its for testing, may removed in production.
    // const pubKey = '0xad6a8f3Cd111229661FD9dc54f6D52FC32fFeC0c'
    // const pvtKey =
    //   '13292266b65527c7665abc01ba929714bc59c4b9fe3d44f7c175449d1405ced9'

    try {
      const receiverPubKey = input.pubKey; // nft receiver pub key
      const pvtKey = input.pvtKey; //nft owner pvt key
      const _tokenId = input.tokenId;
      const totalCopies = input.totalCopies;
      const blockchain = input.blockchain;

      //get account and provider

      const nodeUrl = getNodeUrl(blockchain, this.env.get('STAGE'), '');
      const provider = new ethers.providers.WebSocketProvider(nodeUrl.network);
      const wallet = new ethers.Wallet(pvtKey);
      const account = wallet.connect(provider);
      const ownerPubKey = account.address; //nft owner pub key

      //get contract
      // const source = fs.readFileSync(
      //   resolve(__dirname, './abis/ERC721SmartContract.json'),
      //   'utf8',
      // )
      const contractJsonData = SMART_CONTRACT_1155;
      const nftContract = new ethers.Contract(
        input.collectionAddress,
        contractJsonData.abi,
        account,
      );

      //mint nft token
      const tx = await nftContract.safeTransferFrom(
        ownerPubKey,
        receiverPubKey,
        _tokenId,
        totalCopies,
        1,
        {
          gasPrice: ethers.utils.parseUnits('50', 'gwei'),
          gasLimit: 2000000,
        },
      );

      const txResult = await tx.wait();

      return {
        status: true,
        tokenId: _tokenId,
        error: null,
      };
    } catch (err) {
      console.log('****** ERROR *******');
      console.log('Error message', err.message);
      return {
        status: false,
        error: err.message,
      };
    }
  }

  //----------------------- ERC1155 Functions ENDS HERE ------------------

  //----------------------- ERC721TieredSmartContract Functions STARTS HERE -----------------

  //NOTE: Following functions are for creating ERC1155 Collection.
  async createERC1155TieredCollection(input) {
    try {
      //parameters required....
      // const pubKey = '0xad6a8f3Cd111229661FD9dc54f6D52FC32fFeC0c'
      // const pvtKey =
      //   '13292266b65527c7665abc01ba929714bc59c4b9fe3d44f7c175449d1405ced9'
      const pubKey = input.pubKey;
      const pvtKey = input.pvtKey;
      const name = input.name;
      const symbol = input.symbol;
      const totalCount = input.maxSupply;
      const blockchain = input.blockchain;
      const tokenURI = input.tokenURI
        ? input.tokenURI
        : 'https://mintnfts.io/tokenId/';
      const tokenMaxCounts = input.tokenMaxCounts;

      const contractJsonData = SMART_CONTRACT_1155_TIERED;
      console.log('Print contract name :', contractJsonData.contractName);
      console.log('ContractJsonDataObject :', contractJsonData);

      //for changing the contract name.
      // let newContractName = 'MyNftContract';
      // contractJsonData["contractName"] = newContractName;
      // console.log('New Contract name :', contractJsonData.contractName);

      // TODO: use the string in env file

      const nodeUrl = getNodeUrl(blockchain, this.env.get('STAGE'), '');
      const provider = new ethers.providers.WebSocketProvider(nodeUrl.network);
      const wallet = new ethers.Wallet(pvtKey);
      const account = wallet.connect(provider);

      console.log('deploying contract...');
      const deployArgs = [name, symbol, totalCount, tokenURI, tokenMaxCounts];

      // console.log('logs :', name, symbol, totalCount, tokenURI);

      const contractFactory = new ContractFactory(
        contractJsonData.abi,
        contractJsonData.bytecode,
        account,
      );
      const nftContract = await contractFactory.deploy(...deployArgs, {
        gasPrice: ethers.utils.parseUnits('50', 'gwei'),
        gasLimit: 5000000,
      });
      await nftContract.deployed();

      //mint token if required, then the respective tokenURL will also be required.
      // let tx = await this.mintNFT({
      //   collectionAddress: nftContract.address,
      //   tokenOwner: account.address,
      //   tokenId: null,
      //   pubKey: account.address,
      //   pvtKey: pvtKey
      // });
      // console.log('TokenMinted status :', tx);
      //----------------------

      return {
        status: true,
        name: name,
        symbol: symbol,
        totalCount: totalCount,
        deployedAddress: nftContract.address,
        error: null,
      };
    } catch (err) {
      console.log('******* ERROR *********');
      console.log('ERROR occured:createERC721Collection:', err.message);
      return {
        status: false,
        error: err.message,
        name: null,
        symbol: null,
        totalCount: null,
      };
    }
  }

  async mintNFT1155Tiered(input) {
    //TODO: Its for testing, may removed in production.
    // const pubKey = '0xad6a8f3Cd111229661FD9dc54f6D52FC32fFeC0c'
    // const pvtKey =
    //   '13292266b65527c7665abc01ba929714bc59c4b9fe3d44f7c175449d1405ced9'

    try {
      const pubKey = input.pubKey;
      const pvtKey = input.pvtKey;
      const totalCopies = input.totalCopies;
      const blockchain = input.blockchain;

      //get account and provider
      const nodeUrl = getNodeUrl(blockchain, this.env.get('STAGE'), '');
      const provider = new ethers.providers.WebSocketProvider(nodeUrl.network);
      const wallet = new ethers.Wallet(pvtKey);
      const account = wallet.connect(provider);
      const tierId = input.tokenId; //0,1,2,3 etc. similar to tokenId.

      //get contract
      // const source = fs.readFileSync(
      //   resolve(__dirname, './abis/ERC721SmartContract.json'),
      //   'utf8',
      // )
      const contractJsonData = SMART_CONTRACT_1155_TIERED;
      const nftContract = new ethers.Contract(
        input.collectionAddress,
        contractJsonData.abi,
        account,
      );

      //mint nft token
      const tx = await nftContract.mintTierTokens(pubKey, tierId, totalCopies, {
        gasPrice: ethers.utils.parseUnits('50', 'gwei'),
        gasLimit: 5000000,
      });

      const txResult = await tx.wait();
      let tokenId: number;
      const events = txResult.events;
      // console.log('Events after minting.... :', events);
      events.forEach((event) => {
        if (event && event.event && event.event === 'TransferSingle') {
          tokenId = Number(event.topics[3]);
        }
      });
      return {
        status: true,
        tokenId: tokenId,
        error: null,
      };
    } catch (err) {
      console.log('****** ERROR *******');
      return {
        status: false,
        error: err.message,
      };
    }
  }

  async transferNFT1155Tiered(input: MintToken) {
    //TODO: Its for testing, may removed in production.
    // const pubKey = '0xad6a8f3Cd111229661FD9dc54f6D52FC32fFeC0c'
    // const pvtKey =
    //   '13292266b65527c7665abc01ba929714bc59c4b9fe3d44f7c175449d1405ced9'

    try {
      const receiverPubKey = input.pubKey; // nft receiver pub key
      const pvtKey = input.pvtKey; //nft owner pvt key
      const _tokenId = input.tokenId;
      const totalCopies = input.totalCopies;
      const blockchain = input.blockchain;

      //get account and provider

      const nodeUrl = getNodeUrl(blockchain, this.env.get('STAGE'), '');
      const provider = new ethers.providers.WebSocketProvider(nodeUrl.network);
      const wallet = new ethers.Wallet(pvtKey);
      const account = wallet.connect(provider);
      const ownerPubKey = account.address; //nft owner pub key

      //get contract
      // const source = fs.readFileSync(
      //   resolve(__dirname, './abis/ERC721SmartContract.json'),
      //   'utf8',
      // )
      const contractJsonData = SMART_CONTRACT_1155_TIERED;
      const nftContract = new ethers.Contract(
        input.collectionAddress,
        contractJsonData.abi,
        account,
      );

      //mint nft token
      const tx = await nftContract.safeTransferFrom(
        ownerPubKey,
        receiverPubKey,
        _tokenId,
        totalCopies,
        1,
        {
          gasPrice: ethers.utils.parseUnits('50', 'gwei'),
          gasLimit: 2000000,
        },
      );

      const txResult = await tx.wait();

      return {
        status: true,
        tokenId: _tokenId,
        error: null,
      };
    } catch (err) {
      console.log('****** ERROR *******');
      console.log('Error message', err.message);
      return {
        status: false,
        error: err.message,
      };
    }
  }

  //------------- ERC1155Tier Smartcontract functions ends here ---------------------//

  //----------------------- ERC721TieredSmartContract Functions STARTS HERE -----------------

  async createERC1155GeneratedCollection(input: SmartContract) {
    try {
      //parameters required....
      // const pubKey = '0xad6a8f3Cd111229661FD9dc54f6D52FC32fFeC0c'
      // const pvtKey =
      //   '13292266b65527c7665abc01ba929714bc59c4b9fe3d44f7c175449d1405ced9'

      const pubKey = input.pubKey;
      const pvtKey = input.pvtKey;

      const name = input.name;
      const symbol = input.symbol;
      const totalCount = input.maxSupply;
      const tokenURI = input.tokenURI;
      const blockchain = input.blockchain
        ? input.tokenURI
        : 'https://mintnfts.io/tokenId/';
      const isRevealed = input.unrevealUri ? false : true; //TODO: set as per user selection
      const unRevealedURI =
        input.unrevealUri ?? 'https://gateway.pinata.cloud/ipfs/welcome.json'; //TODO: set as per user

      const contractJsonData = SMART_CONTRACT_1155_GENERATED;
      console.log('Print contract name :', contractJsonData.contractName);
      console.log('ContractJsonDataObject :', contractJsonData);

      //for changing the contract name.
      // let newContractName = 'MyNftContract';
      // contractJsonData["contractName"] = newContractName;
      // console.log('New Contract name :', contractJsonData.contractName);

      // TODO: use the string in env file
      const nodeUrl = getNodeUrl(blockchain, this.env.get('STAGE'), '');
      const provider = new ethers.providers.WebSocketProvider(nodeUrl.network);
      const wallet = new ethers.Wallet(pvtKey);
      const account = wallet.connect(provider);

      console.log('deploying contract...');
      const deployArgs = [
        name,
        symbol,
        totalCount,
        tokenURI,
        isRevealed,
        unRevealedURI,
      ];

      // console.log('logs :', name, symbol, totalCount, tokenURI);

      const contractFactory = new ContractFactory(
        contractJsonData.abi,
        contractJsonData.bytecode,
        account,
      );
      const nftContract = await contractFactory.deploy(...deployArgs, {
        gasPrice: ethers.utils.parseUnits('50', 'gwei'),
        gasLimit: 5000000,
      });
      await nftContract.deployed();

      //mint token if required, then the respective tokenURL will also be required.
      // let tx = await this.mintNFT({
      //   collectionAddress: nftContract.address,
      //   tokenOwner: account.address,
      //   tokenId: null,
      //   pubKey: account.address,
      //   pvtKey: pvtKey
      // });
      // console.log('TokenMinted status :', tx);
      //----------------------

      return {
        status: true,
        name: name,
        symbol: symbol,
        totalCount: totalCount,
        deployedAddress: nftContract.address,
        error: null,
      };
    } catch (err) {
      console.log('******* ERROR *********');
      console.log('ERROR occured:createERC721Collection:', err.message);
      return {
        status: false,
        error: err.message,
        name: null,
        symbol: null,
        totalCount: null,
      };
    }
  }

  async mintNFT1155Generated(input: MintToken) {
    //TODO: Its for testing, may removed in production.
    // const pubKey = '0xad6a8f3Cd111229661FD9dc54f6D52FC32fFeC0c'
    // const pvtKey =
    //   '13292266b65527c7665abc01ba929714bc59c4b9fe3d44f7c175449d1405ced9'

    try {
      const pubKey = input.pubKey;
      const pvtKey = input.pvtKey;
      const totalCopies = input.totalCopies;
      const blockchain = input.blockchain;

      //get account and provider
      const nodeUrl = getNodeUrl(blockchain, this.env.get('STAGE'), '');
      const provider = new ethers.providers.WebSocketProvider(nodeUrl.network);
      const wallet = new ethers.Wallet(pvtKey);
      const account = wallet.connect(provider);

      //get contract
      // const source = fs.readFileSync(
      //   resolve(__dirname, './abis/ERC721SmartContract.json'),
      //   'utf8',
      // )
      const contractJsonData = SMART_CONTRACT_1155_GENERATED;
      const nftContract = new ethers.Contract(
        input.collectionAddress,
        contractJsonData.abi,
        account,
      );

      //mint nft token
      const tx = await nftContract.mint(pubKey, {
        gasPrice: ethers.utils.parseUnits('50', 'gwei'),
        gasLimit: 2000000,
      });

      const txResult = await tx.wait();
      let tokenId: number;
      const events = txResult.events;
      events.forEach((event) => {
        if (event && event.event && event.event === 'TransferSingle') {
          tokenId = Number(event.args[3]);
        }
      });
      return {
        status: true,
        tokenId: tokenId,
        error: null,
      };
    } catch (err) {
      console.log('****** ERROR *******');
      return {
        status: false,
        error: err.message,
      };
    }
  }

  async transferNFT1155Generated(input: MintToken) {
    //TODO: Its for testing, may removed in production.
    // const pubKey = '0xad6a8f3Cd111229661FD9dc54f6D52FC32fFeC0c'
    // const pvtKey =
    //   '13292266b65527c7665abc01ba929714bc59c4b9fe3d44f7c175449d1405ced9'

    try {
      const receiverPubKey = input.pubKey; // nft receiver pub key
      const pvtKey = input.pvtKey; //nft owner pvt key
      const _tokenId = input.tokenId;
      const totalCopies = input.totalCopies;
      const blockchain = input.blockchain;

      //get account and provider
      const nodeUrl = getNodeUrl(blockchain, this.env.get('STAGE'), '');
      const provider = new ethers.providers.WebSocketProvider(nodeUrl.network);
      const wallet = new ethers.Wallet(pvtKey);
      const account = wallet.connect(provider);
      const ownerPubKey = account.address; //nft owner pub key

      //get contract
      // const source = fs.readFileSync(
      //   resolve(__dirname, './abis/ERC721SmartContract.json'),
      //   'utf8',
      // )
      const contractJsonData = SMART_CONTRACT_1155_GENERATED;
      const nftContract = new ethers.Contract(
        input.collectionAddress,
        contractJsonData.abi,
        account,
      );

      //mint nft token
      const tx = await nftContract.safeTransferFrom(
        ownerPubKey,
        receiverPubKey,
        _tokenId,
        totalCopies,
        1,
        {
          gasPrice: ethers.utils.parseUnits('50', 'gwei'),
          gasLimit: 2000000,
        },
      );

      const txResult = await tx.wait();

      return {
        status: true,
        tokenId: _tokenId,
        error: null,
      };
    } catch (err) {
      console.log('****** ERROR *******');
      console.log('Error message', err.message);
      return {
        status: false,
        error: err.message,
      };
    }
  }

  async revealNfts(input: MintToken) {
    //TODO: Its for testing, may removed in production.
    // const pubKey = '0xad6a8f3Cd111229661FD9dc54f6D52FC32fFeC0c'
    // const pvtKey =
    //   '13292266b65527c7665abc01ba929714bc59c4b9fe3d44f7c175449d1405ced9'

    try {
      const receiverPubKey = input.pubKey; // nft receiver pub key
      const pvtKey = input.pvtKey; //nft owner pvt key
      const blockchain = input.blockchain;

      //get account and provider
      const nodeUrl = getNodeUrl(blockchain, this.env.get('STAGE'), '');
      const provider = new ethers.providers.WebSocketProvider(nodeUrl.network);
      const wallet = new ethers.Wallet(pvtKey);
      const account = wallet.connect(provider);
      const ownerPubKey = account.address; //nft owner pub key

      const contractJsonData = SMART_CONTRACT_1155_GENERATED;
      const nftContract = new ethers.Contract(
        input.collectionAddress,
        contractJsonData.abi,
        account,
      );

      //mint nft token
      const tx = await nftContract.setRevealed({
        gasPrice: ethers.utils.parseUnits('50', 'gwei'),
        gasLimit: 2000000,
      });

      const txResult = await tx.wait();

      return {
        status: true,
        error: null,
      };
    } catch (err) {
      console.log('****** ERROR *******');
      console.log('Error message', err.message);
      return {
        status: false,
        error: err.message,
      };
    }
  }
  //------------- ERC1155Tier Smartcontract functions ends here ---------------------//

  //It will return $total numnber of fresh wallets along with their private key and mnemonics.
  async createCustodianWallet() {
    console.log('Creating wallet-------');
    try {
      const wallet = ethers.Wallet.createRandom();
      // {
      //   publicKey: wallet.address,
      //   mnemonic: wallet.mnemonic.phrase,
      //   privateKey: wallet.privateKey
      // }

      if (wallet) {
        return {
          status: true,
          pubKey: wallet.address,
          pvtKey: wallet.privateKey,
          error: null,
        };
      }
    } catch (err) {
      return 'Error occured while creating custodian wallet, pls try again';
    }
  }
}
