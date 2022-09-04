// contracts/GameItems.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract ERC1155TieredSmartContract is ERC1155Supply, Ownable, ReentrancyGuard {
    string public name;
    string public symbol;
    using Counters for Counters.Counter;
    using Strings for uint256;
    uint256 public maxTokenId;

    // tracks price of each nft
    uint256 price;

    //It is max tokens can be generated.
    uint256 public maxSupply;

    //can be owner or any contract or any address selected by owner.
    mapping(address => bool) isMinter;

    // max supply of each tier/token
    mapping(uint256 => uint256) public tokensMaxSupply;

    string baseURI = "https://gateway.pinata.cloud/ipfs/";

    address public collectionOwner;

    //_maxTokensSupply is array of count of max tokens count for each tokenId
    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _maxSupply,
        string memory _uri,
        uint256[] memory _maxTokensSupply,
        uint256 _price,
        address _collectionOwner
    ) ERC1155(_uri) {
        name = _name;
        symbol = _symbol;
        maxSupply = _maxSupply;
        baseURI = _uri;
        price = _price;
        collectionOwner = _collectionOwner;
        require(
            _maxTokensSupply.length > 0,
            "ERROR: _maxTokensSupply is empty array"
        );

        uint256 tempSupply = 0;
        for (
            uint256 counter = 0;
            counter < _maxTokensSupply.length;
            counter++
        ) {
            tempSupply += _maxTokensSupply[counter];
            tokensMaxSupply[counter] = _maxTokensSupply[counter];
        }
        require(
            _maxSupply == tempSupply,
            "ERROR: sumof max supply of all tokens should be equal to max supply of SC"
        );
        maxTokenId = _maxTokensSupply.length - 1;
        addMinter(msg.sender);
    }

    //mint a tier nft
    /// @dev tierId is token id of the nft. nftCount, is the total nft to be minted for a particular tier.
    function mintTierTokens(
        address tokenOwner,
        uint256 tierId,
        uint256 nftCount
    ) public payable nonReentrant returns (uint256) {
        require(
            msg.value >= price * nftCount,
            "Incorrect NFT price amount sent"
        );
        require(
            nftCount + totalSupply(tierId) <= tokensMaxSupply[tierId],
            "Can't mint more than max supply of the token"
        );
        require(nftCount > 0, "nftcount should be greater than 0");
        _mint(tokenOwner, tierId, nftCount, "");
        return tierId;
    }

    /**
     * @dev Throws if called by any account other than the minter.
     */
    modifier onlyMinter() {
        require(isMinter[_msgSender()] == true, "ER: Caller is not the minter");
        _;
    }

    function addMinter(address _account) public onlyOwner {
        isMinter[_account] = true;
    }

    function removeMinter(address _account) public onlyOwner {
        isMinter[_account] = false;
    }

    function uri(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        if (tokenId <= maxTokenId)
            return
                string(abi.encodePacked(baseURI, tokenId.toString(), ".json"));
        else return "ER: Invalid tokenId";
    }

    function setURI(string memory newuri) external onlyOwner {
        baseURI = newuri;
        _setURI(newuri);
    }

    function getBaseURI() external view returns (string memory) {
        return baseURI;
    }

    function setPrice(uint256 _price) external onlyOwner {
        price = _price;
    }

    function setCollectionOwner(address _collectionOwner) public {
        require(
            msg.sender == collectionOwner,
            "Owner collection owner can change owner"
        );
        collectionOwner = _collectionOwner;
    }

    function withdrawFunds() external nonReentrant {
        require(
            msg.sender == collectionOwner,
            "Owner collection owner can change owner"
        );
        (bool success, ) = msg.sender.call{value: address(this).balance}("");
        require(success, "Transfer failed.");
    }
}
