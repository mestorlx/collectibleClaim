pragma solidity ^0.4.18;

import "../node_modules/zeppelin-solidity/contracts/ownership/Ownable.sol";
import "../node_modules/zeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";

/**
 * @title LeToken
 * @dev very unique and rare ERC721 compliant token example to test the TokenClaim contract
 */
contract LeToken is ERC721Token, Ownable {
    // non-divisible token
    uint8 public constant decimals = 0;
    /**
    * @dev Constructor function 
    */
    function LeToken() public ERC721Token("le'Token", "LTA"){

    }
    /** 
    * @dev we set the uri on mint to prevent further changes
    * @param _to address the beneficiary that will own the minted collectible
    * @param _uri string URI confirming to EIP 1047: Token Metadata JSON Schema 
    * see (https://eips.ethereum.org/EIPS/eip-1047)
    */
    function mint(address _to, string _uri) public onlyOwner{
        super._mint(_to, super.totalSupply());
        super._setTokenURI((super.totalSupply()-1), _uri);
    }
}