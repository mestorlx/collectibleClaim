import assertRevert from "../node_modules/zeppelin-solidity/test/helpers/assertRevert";

var ZeppelinEasterEggsCollectibles = artifacts.require('ZeppelinEasterEggsCollectibles.sol')

contract('ZeppelinEasterEggsCollectibles', function(accounts) {
    let owner = accounts[0];
    let notOwner = accounts[1];
    let zeec;

    beforeEach('setup contract before each test', async function () {
        zeec = await ZeppelinEasterEggsCollectibles.new({ from: owner });
    })
    
    it("First account should be owner", async function() {
        let contractOwner = await zeec.owner();
        
        assert.equal(contractOwner, owner, "The owner of the contract is not accounts[0]");
    });

    it("Should have name, symbol and  0 balance", async function() {
        let balance = await zeec.totalSupply();
        const name = await zeec.name();
        const symbol = await zeec.symbol();

        assert.equal(name, "Zeppelin Easter Eggs Collectibles", "Wrong token name");
        assert.equal(symbol, "ZEEC", "Wrong token symbol");
        assert.equal(balance.valueOf(), 0, "Balance is not 0");

    });

    it("Owner should be able to mint", async function(){
        zeec.mint(owner, "super awesome");
        let balance = await zeec.totalSupply();

        assert.equal(balance.valueOf(), 1, "The owner account does not have the minted collectible");
    });

    it("Others should not be able to mint", async () => {
        await zeec.transferOwnership(notOwner);
        let contractOwner = await zeec.owner();

        await assert.notEqual(contractOwner, owner);
        await assertRevert(zeec.mint(owner, "not so awesome"));
    });

    it("Index of coins should be correlated", async () => {
        let uriOne = "awesome one";
        let uriTwo = "awesome two";
        await zeec.mint(accounts[0], uriOne);
        await zeec.mint(accounts[0], uriTwo);

        assert.equal(await zeec.tokenURI(0), uriOne);
        assert.equal(await zeec.tokenURI(1), uriTwo);
    });
});
