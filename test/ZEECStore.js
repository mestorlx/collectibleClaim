import assertRevert from "../node_modules/zeppelin-solidity/test/helpers/assertRevert";
import Web3 from 'web3'
const createKeccakHash = require('keccak')
var ZEECStore = artifacts.require('ZEECStore.sol')
var ZeppelinEasterEggsCollectibles = artifacts.require('ZeppelinEasterEggsCollectibles.sol')

contract('ZEECStore', function(accounts) {
    let owner = accounts[0];
    let notOwner = accounts[1];
    let defaultURI = "https://uri.test";
    let store;
    let zeec;
    let somePreImage = "esta es la frase magica";
    let someHash; // "2d0fcdea612272668d6d99940f2cc4a79c5d06f3a9d1885e4a1021109921169c";
    
    beforeEach("setup contract before each test", async function () {
        zeec = await ZeppelinEasterEggsCollectibles.new({ from: owner });
        store = await ZEECStore.new(await zeec.address);
        let address = store.address;
        zeec.transferOwnership(address);
        someHash = createKeccakHash('keccak256').update(somePreImage).digest('hex');
    })
    
    it("Should make first account an owner", async function() {
        assert.equal(await store.owner(), owner, "The owner of the ZEECStore is not accounts[0]")
        var address = await store.address;

        assert.equal(await zeec.owner(), address, "The owner of the zeec is not ZEECStore");
    });

    it("Owner should be able to add easter-egg", async function(){
        await store.addCollectible(web3.sha3(somePreImage));
        let challenges = await store.collectiblesPendingToClaim();

        assert.equal(challenges.valueOf(), 1, "The owner account does not have the minted collectible")
    });
    
    it("Others should not be able to add easter-egg", async () => {
        await store.transferOwnership(notOwner);
        let contractOwner = await store.owner();

        await assert.notEqual(contractOwner, owner);
        await assertRevert(store.addCollectible(web3.sha3(somePreImage)));
    });
    
    it("When an invalid pre-image is provided collectible should not be minted ", async () => {
        let preImage = "esta NO es la frase magica";
        await store.addCollectible(web3.sha3(somePreImage));
        await store.claimCollectible(owner, preImage, defaultURI);
        let balance = await zeec.totalSupply();

        assert.equal(balance.valueOf(), 0, "The collectible was minted");
    });
    
    it("When a valid pre-image is provided collectible should be minted ", async () => {
        await store.addCollectible(web3.sha3(somePreImage));
        await store.claimCollectible(owner, somePreImage, defaultURI);
        let balance = await zeec.totalSupply();

        assert.equal(balance.valueOf(), 1, "The collectible was not properly minted");
        assert.equal(await zeec.tokenURI(0), defaultURI);
        let challenges = await store.collectiblesPendingToClaim();
        assert.equal(challenges.valueOf(), 0);
    });
    
    it("collectible should not be minted twice", async () => {
        await store.addCollectible(web3.sha3(somePreImage));
        await store.claimCollectible(owner, somePreImage, defaultURI);
        let balance = await zeec.totalSupply();

        assert.equal(balance.valueOf(), 1, "The collectible was not properly minted");
        await store.claimCollectible( notOwner,somePreImage, defaultURI);
        balance = await zeec.totalSupply();
        assert.equal(balance.valueOf(), 1, "Extra collectible was minted");
    });
    
    it("When multiple collectible are added anyone should be claimable", async () => {
        await store.addCollectible(web3.sha3(somePreImage));
        await store.addCollectible(web3.sha3("this is not the collectible you are looking for"));
        let balance = await store.collectiblesPendingToClaim();

        assert.equal(balance.valueOf(), 2, "The challenges where not added");
        await store.claimCollectible(owner,somePreImage, defaultURI);
        balance = await zeec.totalSupply();
        assert.equal(balance.valueOf(), 1, "The collectible was not properly minted");
        assert.equal(await zeec.tokenURI(0), defaultURI);
    });
    
});
