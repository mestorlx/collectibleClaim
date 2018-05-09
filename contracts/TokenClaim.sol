pragma solidity ^0.4.18;

import "./LeToken.sol";
import "../node_modules/zeppelin-solidity/contracts/ownership/Ownable.sol";

/**
 * @title Store and Grant Zeppelin Collectibles
 * Store Zeppelin ERC721 crypto collectibles and grant ownership to anyone that
 * can provide the pre-image of a hash.
 */
contract TokenClaim is Ownable {
    // Store collectible icon (image) 
    string[] internal collectiblesImageIPFS_;
    // Store hash to validate preImages 
    string[] internal hashArray_;
    // Should be private?
    LeToken public leToken_;
    // Default image to use when one is not provided with hash
    string private defaultImageIPFS = "https://ipfs.pics/QmU7VWfd3DN1Hh8fjALhQyJLgtkwxkYP2zz9MDT4rkyVJ1";

    /**
     * @dev Constructor function
     * @param _leToken Contract address for the collectibles contract
     */
    function TokenClaim (address _leToken)public  {
        leToken_ = LeToken(_leToken);   
    }

    /**
     * @notice this should be a function overload but due to a bug on truffle a
     * different name is provided see https://github.com/trufflesuite/truffle/issues/737
     * @dev Add challenge (hash) to internal array and use default image
     * @param _hash should be a 64 charcter long string representing a 32 byte long array in hexa
     * e.g. 846f9cab86db8779ab2d1c07f5967f13e74cfe9e827480d3ebc40905cc10dbe3
     */
    function addCollectibleBT(string _hash) public onlyOwner{
        addCollectible(_hash,defaultImageIPFS);
    }

    /**
     * @dev Add challenge (hash) to internal array and use default image
     * @param _hash should be a 64 charcter long string representing a 32 byte long array in hexa
     * e.g. 846f9cab86db8779ab2d1c07f5967f13e74cfe9e827480d3ebc40905cc10dbe3
     * @param _imageIPFS A URI pointing to a resource with mime type image see EIP 1047
     */
    function addCollectible(string _hash, string _imageIPFS) public onlyOwner{
        hashArray_.push(_hash);
        collectiblesImageIPFS_.push(_imageIPFS);
    }

    /**
     * @dev Get number of challenges that can be claimed
     */
    function collectiblesPendingToClaim() public view returns (uint256) {
        return hashArray_.length;
    }
    
    /**
     * @notice Not implemented instead of URI will return JSON content
     * @dev Convert JSON to uri
     * @param _json string with json content
     * @return string with uri pointing to json 
     */
    function convertJSONtoURI(string _json) private pure returns (string uri) {
        /// Implement
        return _json;

    }

    /**
     * @notice Not fully implemented instead of URI will return JSON content
     * @dev Create a URI pointing to a Metadata JSON  according to ERC721 from
     * input data.
     * @param _preImage string that gives the hash
     * @param _imageIPFS string with a link pointing to the collectible image
     * @param _hash hash corresponding to the _preImage
     * @return string with uri pointing to json 
     */
    function createURI(string _preImage, string _imageIPFS, string _hash) private pure returns (string uri) {
        return convertJSONtoURI(createJSON(_preImage, _imageIPFS, _hash));
    }

    /**
     * @dev Ad-hoc function to concatenate strings without external library. This functionality 
     * should be added to solidity? 
     * @param _string1 firs string
     * @param _string2 second string
     * @param _string3 third string
     * @return string string1+string2+string3
     */
    function stringConcatenation(string _string1, string _string2, string _string3) internal pure returns (string ){
        bytes memory bString1 = bytes(_string1);
        bytes memory bString2 = bytes(_string2);
        bytes memory bString3 = bytes(_string3);
        uint totalLength = bString1.length + bString2.length + bString3.length;
        bytes memory stringBytes = new bytes(totalLength);
        uint i = 0;
        for (uint j = 0; j < bString1.length; j++) stringBytes[i++] = bString1[j];
        for ( j = 0; j < bString2.length; j++) stringBytes[i++] = bString2[j];
        for ( j = 0; j < bString3.length; j++) stringBytes[i++] = bString3[j];
        return string(stringBytes);
    }

    /**
     * @dev Create a string containing a Metadata JSON according to ERC721 from
     * input data.
     * @param _preImage string that gives the hash
     * @param _imageIPFS string with a link pointing to the collectible image
     * @param _hash hash corresponding to the _preImage
     * @return string with json content
     */
    function createJSON(string _preImage, string _imageIPFS, string _hash) private pure returns (string json) {
        // Sample JSON
        // {
        //     "name": “2d0fcdea612272668d6d99940f2cc4a79c5d06f3a9d1885e4a1021109921169c”,
        //     "description": “esta es la frase magica”, 
        //     "image": "https://ipfs.infura.io/ipfs/QmWc6YHE815F8kExchG9kd2uSsv7ZF1iQNn23bt5iKC6K3/image",
        // }
        /// The JSON string its: preImage + image link+ hash + characters required by json
        string memory name = "{\"name\": \"";
        json = stringConcatenation("",name, _hash);
        string memory description = "\",\"description\":\"";
        json = stringConcatenation(json, description, _preImage);
        string memory image = "\",\"image\":\"";
        json = stringConcatenation(json, image, _imageIPFS);
        string memory tail = "\",}";
        json = stringConcatenation(json, tail, "");
    }

    /** 
     * @dev Ad-hoc function to convert hex to decimal
     * should be added to solidity? 
     * @param _hex character containing half a byte in ascii
     * e.g. f from fe
     * @return equivalent decimal value
     */
    function convertHexToChar(uint _hex) public pure returns (uint) {
        if (byte(_hex) >= byte('0') && byte(_hex) <= byte('9')) {
            return _hex - uint(byte('0'));
        }
        if (byte(_hex) >= byte('a') && byte(_hex) <= byte('f')) {
            return 10 + _hex - uint(byte('a'));
        }
        if (byte(_hex) >= byte('A') && byte(_hex) <= byte('F')) {
            return 10 + _hex - uint(byte('A'));
        }
    }

    /**
     * @dev Ad-hoc function to convert string containing a hash in hexa to hash
     * should be made generic?
     * @param _s "stringified" hash
     * @return hash as bytes array
     * @notice hash array is half the length of the string
     */
    function stringToHash(string _s) public pure returns (bytes hash) {
        bytes memory bs = bytes(_s);
        // just hard-coded for hash
        require(bs.length == 64);
        // can be made generic
        hash = new bytes(32);
        for (uint i = 0; i < 32; ++i){
            // Not bit shift operator
            hash[i] = byte(convertHexToChar(uint(bs[2*i])) * 16 +convertHexToChar(uint(bs[2*i+1])));
        }
        return hash;
    }

    /**
     * @dev Ad-hoc function to compare hash to "stringified" hash
     * @param _stringHash "stringified" hash
     * @param _hash hash as bytes array
     * @return true if are equivalent
     * @notice hash array is half the length of the string
     */
    function stringToHashCompare(string _stringHash, bytes32 _hash) public pure returns (bool same){
        bytes memory hash = stringToHash(_stringHash);
        same = true;
        for(uint i = 0; i < 32; i++){
            if(hash[i] != _hash[i]){
                // Save some gas
                same = false;
                break;
            }
        }

    }
    
    /**
     * @dev Verify if the pre-image corresponds to any stored hash
     * and if so mint the collectible and remove hash from available challenges.
     * _to address to grant collectible ownership
     * _preImage solution to the challenge i.e. easter-egg
     */
    function claimcollectible(address _to, string _preImage) public {
        /// First we get the hash of the pre image
        var hash = keccak256(_preImage);
        /// We compare with the array
        for (uint256 i = 0; i < hashArray_.length; i++){
            //if(hash == hashArray[i]){
            if(stringToHashCompare(hashArray_[i],hash )){  
                /// We mint the collectible and assign it to the owner
                var uri = createURI(_preImage, collectiblesImageIPFS_[i], hashArray_[i]);
                leToken_.mint(_to,uri);
                /// we remove the hash from the arry. We move the last element to override.
                hashArray_[i] = hashArray_[hashArray_.length-1];
                collectiblesImageIPFS_[i] = collectiblesImageIPFS_[collectiblesImageIPFS_.length-1];
                /// we remove last element
                hashArray_.length--;
                collectiblesImageIPFS_.length--;
            }
        }
    }
}