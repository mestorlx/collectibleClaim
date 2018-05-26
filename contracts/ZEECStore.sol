pragma solidity ^0.4.18;

import "./ZeppelinEasterEggsCollectibles.sol";
import "../node_modules/zeppelin-solidity/contracts/ownership/Ownable.sol";

/**
 * @title Store and Grant Zeppelin Collectibles
 * Store Zeppelin ERC721 crypto collectibles and grant ownership to anyone that
 * can provide the pre-image of a hash.
 */
contract ZEECStore is Ownable {
    // Store hash to validate preImages 
    bytes32[] private hashArray_;
    // Zeppelin collectibles
    ZeppelinEasterEggsCollectibles private ZeppelinEasterEggsCollectibles_;

    /**
     * @dev Constructor function
     * @param _ZeppelinEasterEggsCollectibles Contract address for the collectibles contract
     */
    function ZEECStore (address _ZeppelinEasterEggsCollectibles)public  {
        ZeppelinEasterEggsCollectibles_ = ZeppelinEasterEggsCollectibles(_ZeppelinEasterEggsCollectibles);   
    }
    /**
     * @dev Add challenge (hash) to internal array and use default image
     * @param _hash sha3 hash
     */
    function addCollectible(bytes32 _hash) public onlyOwner{
        hashArray_.push(_hash);
    }

    /**
     * @dev Get number of challenges that can be claimed
     */
    function collectiblesPendingToClaim() public view returns (uint256) {
        return hashArray_.length;
    }

    /**
     * @dev Compare hashes
     * @param _firstHash reference hash
     * @param _secondHash second hash
     * @return true if are equivalent
     */
    function hashCompare(bytes32 _firstHash, bytes32 _secondHash) public pure returns (bool same){
        same = true;
        for(uint i = 0; i < 32; i++){
            if(_firstHash[i] != _secondHash[i]){
                // Save some gas
                same = false;
                break;
            }
        }
    }
    
    /**
     * @dev Verify if the pre-image corresponds to any stored hash
     * and if so mint the collectible and remove hash from available challenges.
     * @param _to address to grant collectible ownership
     * @param _preImage solution to the challenge i.e. easter-egg
     * @param _collectibleURI URI conforming to EIP 1047: Token Metadata JSON Schema 
     * see (https://eips.ethereum.org/EIPS/eip-1047)
     */
    function claimCollectible(address _to, string _preImage, string _collectibleURI) public {
        /// First we get the hash of the pre image
        bytes32 hash = keccak256(_preImage);
        /// We compare with the array
        for (uint256 i = 0; i < hashArray_.length; i++){
            //if(hash == hashArray[i]){
            if(hashCompare(hashArray_[i],hash )){  
                ZeppelinEasterEggsCollectibles_.mint(_to,_collectibleURI);
                /// we remove the hash from the arry. We move the last element to override.
                hashArray_[i] = hashArray_[hashArray_.length-1];
                /// we remove last element
                hashArray_.length--;
            }
        }
    }
}