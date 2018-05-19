import Web3 from 'web3';
export var provider ; 
export var web3 ;
export var owner ;
export var notOwner ;
export var userAccount;
// Set GAS limit for debug
export const GAS = 1000000;                 
// Show errors
export const showError = error => {
  console.error(error);
  $("#errors").text(error);
};
// Setup instance for web3. Detect metamask

export async function setup(){
  console.log("Setting provider");
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof window == 'undefined' ) console.log("Window is not defined");
  if (typeof window.web3 !== 'undefined') {
    // Use Mist/MetaMask's provider
    console.log(' MetaMask is running');
    web3 = new Web3(web3.currentProvider);
  } else {
    console.log('MetaMask is not running default to local testrpc!');
    provider = await new Web3.providers.HttpProvider("http://localhost:8545");
    web3 = await new Web3(provider);
  }
  // Set owner and not owner for debug
  owner = await web3.eth.accounts[0];
  notOwner = await web3.eth.accounts[1];
  userAccount = notOwner;
}

