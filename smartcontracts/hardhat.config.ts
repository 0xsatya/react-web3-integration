import * as dotenv from "dotenv";
import 'hardhat-deploy';
import { HardhatUserConfig } from "hardhat/types";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-solhint";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "hardhat-contract-sizer";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.9",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      }
    ]
  },
  namedAccounts: {
    deployer: {
      default: 0, // here this will by default take the first account as deployer
      1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
      4: '0xdf3F6A31a90A7abE3BA0C6DAAe62808E958d3467', // but for rinkeby it will be a specific address
      "goerli": '0xdf3F6A31a90A7abE3BA0C6DAAe62808E958d3467', //it can also specify a specific netwotk name (specified in hardhat.config.js)
    },
    admin:{
        default: 1, // here this will by default take the second account as feeCollector (so in the test this will be a different account than the deployer)
        1: '0xd872F34C3eF4c60028a46795Dd66Bc65533DE2eb', // on the mainnet the feeCollector could be a multi sig
        4: '0xd872F34C3eF4c60028a46795Dd66Bc65533DE2eb', // on rinkeby it could be another account
    }
  },
  networks: {
    hardhat: {
      allowUnlimitedContractSize: false,
    },
    localhost: {
      url: 'http://127.0.0.1:8545',
      // accounts: [process.env.PRIVATE_KEY, process.env.PRIVATE_KEY2],
      saveDeployments: true,
    },
    ganache: {
      url: 'http://127.0.0.1:7545',
      // accounts: [process.env.PRIVATE_KEY, process.env.PRIVATE_KEY2],
    },
    rinkeby: {
      url: process.env.RINKEBY_URL || "",
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      saveDeployments: true,
    },
    mainnet: {
      url: process.env.MAIN_NET_URL,
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      gasPrice: 50000000000,
    },
    polygon: {
      url: "https://nd-408-541-804.p2pify.com/84fe3873a340b6d6654023b6e4426ccd", 
      gasPrice: 50000000000,
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    matic: {
      url: "https://nd-408-541-804.p2pify.com/84fe3873a340b6d6654023b6e4426ccd",
      gasPrice: 50000000000,
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: {
      rinkeby: process.env.ETHERSCAN_API_KEY || "",
    },
  },
  gasReporter: {
    enabled: false,
    currency: 'USD',
    coinmarketcap: '03c08687-31bd-4ca0-88a2-ba13fb634273'
    // gasPrice: 40
  },
  contractSizer: {
    alphaSort: false,
    disambiguatePaths: false,
    runOnCompile: false,
    strict: true
  }
};
export default config;
