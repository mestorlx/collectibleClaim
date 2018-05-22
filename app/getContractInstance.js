import contract from "truffle-contract";
import TokenClaimArtifact from "../build/contracts/TokenClaim.json";
import LeTokenArtifact from "../build/contracts/LeToken.json";
import addresses from "../addresses.json";
import Web3 from "web3";
import { provider, web3, setup, userAccount } from './constants'
export var owner;

// Set contract instances
export async function getContractInstance() {
  await setup();
  const tokenClaimContract = contract(TokenClaimArtifact);
  const leTokenContract = contract(LeTokenArtifact);
  web3.eth.defaultAccount = userAccount;
  tokenClaimContract.setProvider(provider);
  leTokenContract.setProvider(provider);
  console.log("TokenClaim address:" + addresses['tokenClaimAddress']);
  console.log("LeToken address:" + addresses['lTokenAddress']);
  const tokenClaimInstance = await tokenClaimContract.at(addresses['tokenClaimAddress']);
  const leTokenInstance = await leTokenContract.at(addresses['lTokenAddress']);
  owner = await tokenClaimInstance.owner.call();
  console.log("The owner is:");
  console.log(owner);
  return [leTokenInstance, tokenClaimInstance];
}