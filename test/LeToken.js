import assertRevert from "../node_modules/zeppelin-solidity/test/helpers/assertRevert";

var LeToken = artifacts.require('LeToken.sol')

contract('LeToken', function(accounts) {
    let owner = accounts[0];
    let notOwner = accounts[1];
    let lToken;

    beforeEach('setup contract before each test', async function () {
        lToken = await LeToken.new({ from: owner });
    })
    
    it("First account should be owner", async function() {
        let contractOwner = await lToken.owner();
        
        assert.equal(contractOwner, owner, "The owner of the contract is not accounts[0]");
    });

    it("Should have name, symbol and  0 balance", async function() {
        let balance = await lToken.totalSupply();
        const name = await lToken.name();
        const symbol = await lToken.symbol();

        assert.equal(name, "le'Token", "Wrong token name");
        assert.equal(symbol, "LTA", "Wrong token symbol");
        assert.equal(balance.valueOf(), 0, "Balance is not 0");

    });

    it("Owner should be able to mint", async function(){
        lToken.mint(owner, "super awesome");
        
        let balance = await lToken.totalSupply();

        assert.equal(balance.valueOf(), 1, "The owner account does not have the minted collectible");
    });

    it("Others should not be able to mint", async () => {
        await lToken.transferOwnership(notOwner);
        let contractOwner = await lToken.owner();

        await assert.notEqual(contractOwner, owner);
        await assertRevert(lToken.mint(owner, "not so awesome"));
    });

    it("Index of coins should be correlated", async () => {
        let uriOne = "awesome one";
        let uriTwo = "awesome two";

        await lToken.mint(accounts[0], uriOne);
        await lToken.mint(accounts[0], uriTwo);

        assert.equal(await lToken.tokenURI(0), uriOne);
        assert.equal(await lToken.tokenURI(1), uriTwo);
    });
});
