import Web3 from 'web3';

export const provider = new Web3.providers.HttpProvider("http://localhost:8545");
export const web3 = new Web3(provider);
export const owner = web3.eth.accounts[0];
export const notOwner = web3.eth.accounts[1];

export const GAS = 1000000;                 // amount of gas to use for the transaction
export const showError = error => {
  console.error(error);
  $("#errors").text(error);
};
