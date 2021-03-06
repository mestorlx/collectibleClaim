const ZEECStore = artifacts.require('ZEECStore.sol')
const ZeppelinEasterEggsCollectibles = artifacts.require('ZeppelinEasterEggsCollectibles.sol')
const fs = require("fs");


module.exports = async function(deployer) {
  deployer.deploy(ZeppelinEasterEggsCollectibles).then(function (){
    return deployer.deploy(ZEECStore,ZeppelinEasterEggsCollectibles.address).then(function(){
      var address = ZEECStore.address;
      let zeec = ZeppelinEasterEggsCollectibles.at(ZeppelinEasterEggsCollectibles.address);
      zeec.transferOwnership(address);
      const addresses = {
        zeecAddress: ZeppelinEasterEggsCollectibles.address,
        storeAddress: ZEECStore.address
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