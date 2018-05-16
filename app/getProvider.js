import Web3 from "web3";

const getProvider = () => {
  console.log("Get provider");
  return new Web3.providers.HttpProvider("http://localhost:8545");
};

export default getProvider;