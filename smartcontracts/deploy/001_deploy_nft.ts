import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts} = hre;
  const {deploy, execute} = deployments;

  const {deployer, admin} = await getNamedAccounts();


  const args1 = ["NftOriginals", "NFO"];

  await deploy('NftsOriginal', {
    from: deployer,
    args: args1,
    log: true,
  });

};
export default func;
func.tags = ['NftsOriginal'];
