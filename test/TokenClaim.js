import assertRevert from "../node_modules/zeppelin-solidity/test/helpers/assertRevert";
import Web3 from 'web3'
const createKeccakHash = require('keccak')
var TokenClaim = artifacts.require('TokenClaim.sol')
var LeToken = artifacts.require('LeToken.sol')

function convertHash(ascii){
    let bytes = new Uint8Array(32);
    
    for (let i = 0; i < 32; i++) {
        let hexString = "0x"+ascii.substring(2*i,2*i+2);
        bytes[i] = parseInt(hexString, 16);
        console.log("Converting:" + hexString + " to:" + bytes[i]);
    }
    return bytes;
}
contract('TokenClaim', function(accounts) {
    let owner = accounts[0];
    let notOwner = accounts[1];
    let defaultURI = "https://uri.test";
    let tokenClaim;
    let lToken;
    let somePreImage = "esta es la frase magica";
    let someHash; // "2d0fcdea612272668d6d99940f2cc4a79c5d06f3a9d1885e4a1021109921169c";
    
    beforeEach("setup contract before each test", async function () {
        lToken = await LeToken.new({ from: owner });
        tokenClaim = await TokenClaim.new(lToken.address);
        let address = await tokenClaim.address;

        lToken.transferOwnership(address);
        someHash = createKeccakHash('keccak256').update(somePreImage).digest('hex');
        
        
    })
    
    // it("Should make first account an owner", async function() {
    //     assert.equal(await tokenClaim.owner(), owner, "The owner of the tokenClaim is not accounts[0]")
    //     var address = await tokenClaim.address;
    //     assert.equal(await lToken.owner(), address, "The owner of the lToken is not TokenClaim");
    // });

    // it("Owner should be able to add easter-egg", async function(){
    //     await tokenClaim.addCollectible(web3.fromAscii(someHash));
    //     let challenges = await tokenClaim.collectiblesPendingToClaim();

    //     assert.equal(challenges.valueOf(), 1, "The owner account does not have the minted collectible")
    // });
    
    // it("Others should not be able to add easter-egg", async () => {
    //     await tokenClaim.transferOwnership(notOwner);
    //     let contractOwner = await tokenClaim.owner();
    //     await assert.notEqual(contractOwner, owner);
    //     await assertRevert(tokenClaim.addCollectible(web3.fromAscii(someHash)));
    // });
    
    // it("When an invalid pre-image is provided collectible should not be minted ", async () => {
    //     let preImage = "esta NO es la frase magica";
    //     await tokenClaim.addCollectible(web3.fromAscii(someHash));
    //     await tokenClaim.claimcollectible(owner, preImage, defaultURI);
    //     let balance = await lToken.totalSupply();
    //     assert.equal(balance.valueOf(), 0, "The collectible was minted");
    // });
    
    it("When a valid pre-image is provided collectible should be minted ", async () => {
        console.log("hash :" + someHash);

        // await tokenClaim.addCollectible(web3.fromAscii(someHash,32));
        await tokenClaim.addCollectible(convertHash(someHash));
        await tokenClaim.claimcollectible(owner, somePreImage, defaultURI);
        let balance = await lToken.totalSupply();
        assert.equal(balance.valueOf(), 1, "The collectible was not properly minted");
        assert.equal(await lToken.tokenURI(0), defaultURI);
        let challenges = await tokenClaim.collectiblesPendingToClaim();
        assert.equal(challenges.valueOf(), 0);
    });
    
    // it("collectible should not be minted twice", async () => {
    //     await tokenClaim.addCollectible(web3.fromAscii(someHash));
    //     await tokenClaim.claimcollectible(owner, somePreImage, defaultURI);
    //     let balance = await lToken.totalSupply();
    //     assert.equal(balance.valueOf(), 1, "The collectible was not properly minted");
    //     await tokenClaim.claimcollectible( notOwner,somePreImage, defaultURI);
    //     balance = await lToken.totalSupply();
    //     assert.equal(balance.valueOf(), 1, "Extra collectible was minted");
    // });
    
    // it("When multiple collectible are added anyone should be claimable", async () => {
    //     await tokenClaim.addCollectible(web3.fromAscii(someHash));
    //     let hash = createKeccakHash('keccak256').update("this is not the collectible you are looking for").digest('hex');
    //     await tokenClaim.addCollectible(web3.fromAscii(hash));
    //     let balance = await tokenClaim.collectiblesPendingToClaim();
    //     assert.equal(balance.valueOf(), 2, "The challenges where not added");
    //     await tokenClaim.claimcollectible(owner,somePreImage, defaultURI);
    //     balance = await lToken.totalSupply();
    //     assert.equal(balance.valueOf(), 1, "The collectible was not properly minted");
    //     assert.equal(await lToken.tokenURI(0), defaultURI);
    // });
});
