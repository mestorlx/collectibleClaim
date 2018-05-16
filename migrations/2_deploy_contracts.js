const TokenClaim = artifacts.require('TokenClaim.sol')
const LeToken = artifacts.require('LeToken.sol')
const fs = require("fs");


module.exports = async function(deployer) {
  deployer.deploy(LeToken).then(function (){
    return deployer.deploy(TokenClaim,LeToken.address).then(function(){
      var address = TokenClaim.address;
      let lToken = LeToken.at(LeToken.address);
      lToken.transferOwnership(address);
      const addresses = {
        lTokenAddress: LeToken.address,
        tokenClaimAddress: TokenClaim.address
      };
      fs.writeFile("./addresses.json",JSON.stringify(addresses),function(err) {
        if(err) {
          return console.log(err);
        }
        console.log("The file was saved!");
      });
    });
  });
};