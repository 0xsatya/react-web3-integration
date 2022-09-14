const ethereumMainnet = "";
const ethereumRinkeby = "";

const polygonMainnet = "";
const polygonTest = "https://ws-nd-893-036-432.p2pify.com/e92079a85f5107422afe4e998406cb83";

const solanaMainnet = "";
const solanaTest = "";

export const getNodeUrl = (network, env, address) => {
  const nodeUrls = {
    dev: {
      ethereum: {
        network: ethereumRinkeby,
        contract: `https://rinkeby.etherscan.io/address/${address}`,
        base: `https://rinkeby.etherscan.io/`,
      },
      polygon: {
        network: polygonTest,
        contract: `https://mumbai.polygonscan.com/address/${address}`,
        base: `https://mumbai.polygonscan.com/`,
      },
      solana: {
        network: solanaTest,
        contract: ``,
        base: ``,
      },
    },
    prod: {
      ethereum: {
        network: ethereumMainnet,
        contract: `https://etherscan.io/address/${address}`,
        base: `https://etherscan.io/`,
      },
      polygon: {
        network: polygonMainnet,
        contract: `https://polygonscan.com/address/${address}`,
        base: `https://polygonscan.com/`,
      },
      solana: {
        network: solanaMainnet,
        contract: ``,
        base: ``,
      },
    },
  };

  return nodeUrls[env][network];
};
