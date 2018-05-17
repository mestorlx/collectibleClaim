import contract from "truffle-contract";
import TokenClaimArtifact from "../build/contracts/TokenClaim.json";
import LeTokenArtifact from "../build/contracts/LeToken.json";
import addresses from "../addresses.json";
import Web3 from "web3";
import { provider, web3, owner, setup } from './constants'


// Set contract instances
export default async function getContractInstance() {
  await setup();
  const tokenClaimContract = contract(TokenClaimArtifact);
  const leTokenContract = contract(LeTokenArtifact);
  web3.eth.defaultAccount = owner;
  tokenClaimContract.setProvider(provider);
  leTokenContract.setProvider(provider);
  console.log("TokenClaim address:" + addresses['tokenClaimAddress']);
  console.log("LeToken address:" + addresses['lTokenAddress']);
  const tokenClaimInstance = await tokenClaimContract.at(addresses['tokenClaimAddress']);
  const leTokenInstance = await leTokenContract.at(addresses['lTokenAddress']);
  return [leTokenInstance, tokenClaimInstance];
}