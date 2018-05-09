import assertRevert from "../node_modules/zeppelin-solidity/test/helpers/assertRevert";

const createKeccakHash = require('keccak')
var TokenClaim = artifacts.require('TokenClaim.sol')
var LeToken = artifacts.require('LeToken.sol')

contract('TokenClaim', function(accounts) {
    let owner = accounts[0];
    let notOwner = accounts[1];
    let defaultImageIPFS = "https://ipfs.pics/QmU7VWfd3DN1Hh8fjALhQyJLgtkwxkYP2zz9MDT4rkyVJ1";
    let tokenClaim;
    let lToken;
    let somePreImage = "esta es la frase magica";
    let someHash = "2d0fcdea612272668d6d99940f2cc4a79c5d06f3a9d1885e4a1021109921169c";
    
    function convertToJSON(preImage, hash, imageIPFS){
        let json= "{\"name\": \""+hash+
              "\",\"description\":\""+preImage+
              "\",\"image\":\""+imageIPFS+"\",}";
              return json;
    }
    
    function getJSON(preImage){
        let hash = createKeccakHash('keccak256').update(preImage).digest('hex');
        return convertToJSON(preImage, hash, defaultImageIPFS);
    }

    beforeEach("setup contract before each test", async function () {
        lToken = await LeToken.new({ from: owner });
        tokenClaim = await TokenClaim.new(lToken.address);
        var address = await tokenClaim.address;
        lToken.transferOwnership(address);
    })
    
    it("Should make first account an owner", async function() {
        assert.equal(await tokenClaim.owner(), owner, "The owner of the tokenClaim is not accounts[0]")
        var address = await tokenClaim.address;
        assert.equal(await lToken.owner(), address, "The owner of the lToken is not TokenClaim");
    });

    it("Owner should be able to add easter-egg", async function(){
        await tokenClaim.addCollectible(someHash,defaultImageIPFS);
        let challenges = await tokenClaim.collectiblesPendingToClaim();
        assert.equal(challenges.valueOf(), 1, "The owner account does not have the minted collectible")
    });

    it("Others should not be able to add easter-egg", async () => {
        await tokenClaim.transferOwnership(notOwner);
        let contractOwner = await tokenClaim.owner();
        await assert.notEqual(contractOwner, owner);
        await assertRevert(tokenClaim.addCollectible( someHash,defaultImageIPFS));
    });

    it("When an invalid pre-image is provided collectible should not be minted ", async () => {
        let preImage = "esta NO es la frase magica";
        await tokenClaim.addCollectibleBT(someHash );
        await tokenClaim.claimcollectible(owner,preImage);
        let balance = await lToken.totalSupply();
        assert.equal(balance.valueOf(), 0, "The collectible was minted");
    });

    it("When a valid pre-image is provided collectible should be minted ", async () => {
        await tokenClaim.addCollectibleBT(someHash);
        await tokenClaim.claimcollectible(owner,somePreImage);
        let balance = await lToken.totalSupply();
        assert.equal(balance.valueOf(), 1, "The collectible was not properly minted");
        let json = getJSON(somePreImage);
        assert.equal(await lToken.tokenURI(0), json);
        let challenges = await tokenClaim.collectiblesPendingToClaim();
        assert.equal(challenges.valueOf(), 0);
    });

    it("collectible should not be minted twice", async () => {
        await tokenClaim.addCollectibleBT(someHash);
        await tokenClaim.claimcollectible(owner,somePreImage);
        let balance = await lToken.totalSupply();
        assert.equal(balance.valueOf(), 1, "The collectible was not properly minted");
        tokenClaim.claimcollectible( notOwner,somePreImage);
        balance = await lToken.totalSupply();
        assert.equal(balance.valueOf(), 1, "Extra collectible was minted");
    });
    
    it("When multiple collectible are added anyone should be claimable", async () => {
        await tokenClaim.addCollectibleBT(someHash);
        let hash = createKeccakHash('keccak256').update("this is not the collectible you are looking for").digest('hex');
        await tokenClaim.addCollectibleBT(hash);
        let balance = await tokenClaim.collectiblesPendingToClaim();
        assert.equal(balance.valueOf(), 2, "The challenges where not added");
        await tokenClaim.claimcollectible(owner,somePreImage);
        balance = await lToken.totalSupply();
        assert.equal(balance.valueOf(), 1, "The collectible was not properly minted");
        let json = getJSON(somePreImage);
        assert.equal(await lToken.tokenURI(0), json);
    });

});
