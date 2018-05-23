import contract from "truffle-contract";
import ZEECStoreArtifact from "../build/contracts/ZEECStore.json";
import ZEECArtifact from "../build/contracts/ZeppelinEasterEggsCollectibles.json";
import addresses from "../addresses.json";
import Web3 from "web3";
import { provider, web3, setup, userAccount } from './constants'
export var owner;

// Set contract instances
export async function getContractInstance() {
  await setup();
  const storeContract = contract(ZEECStoreArtifact);
  const zeecContract = contract(ZEECArtifact);
  web3.eth.defaultAccount = userAccount;
  storeContract.setProvider(provider);
  zeecContract.setProvider(provider);
  console.log("store address:" + addresses['storeAddress']);
  console.log("zeec address:" + addresses['zeecAddress']);
  const storeInstance = await storeContract.at(addresses['storeAddress']);
  const zeecInstance = await zeecContract.at(addresses['zeecAddress']);
  owner = await storeInstance.owner.call();
  console.log("The owner is:");
  console.log(owner);
  return [zeecInstance, storeInstance];
}