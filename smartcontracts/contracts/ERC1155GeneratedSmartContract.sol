// contracts/GameItems.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract ERC1155GeneratedSmartContract is ERC1155, Ownable, ReentrancyGuard {
    string public name;
    string public symbol;
    using Counters for Counters.Counter;
    using Strings for uint256;
    Counters.Counter private _tokenIds;

    // tracks price of each nft
    uint256 price;

    //It tracks total tokens generated.
    uint256 public maxSupply;

    //can be owner or any contract or any address selected by owner.
    mapping(address => bool) isMinter;

    string baseURI = "https://gateway.pinata.cloud/ipfs/";

    bool public isRevealed;

    //unrevealedUri is complete path upto json
    string public unRevealedUri;

    address public collectionOwner;

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _maxSupply,
        string memory _uri,
        bool _isRevealed,
        string memory _unRevealedUri,
        uint256 _price,
        address _collectionOwner
    ) ERC1155(_uri) {
        name = _name;
        symbol = _symbol;
        maxSupply = _maxSupply;
        baseURI = _uri;
        isRevealed = _isRevealed;
        unRevealedUri = _unRevealedUri;
        price = _price;
        collectionOwner = _collectionOwner;

        addMinter(msg.sender);
    }

    //mint a single nft
    function mint(address tokenOwner)
        public
        payable
        nonReentrant
        returns (uint256)
    {
        _tokenIds.increment();
        require(msg.value >= price, "Incorrect NFT price amount");
        require(
            _tokenIds.current() <= maxSupply,
            "Can't mint more than max supply"
        );
        uint256 newItemId = _tokenIds.current();
        _mint(tokenOwner, newItemId, 1, "");
        return newItemId;
    }

    //mint nft with multiple copies on the same id
    function mintWithClones(address tokenOwner, uint256 count)
        public
        payable
        nonReentrant
        returns (uint256)
    {
        _tokenIds.increment();
        require(msg.value >= price * count, "Incorrect NFT price amount");
        require(
            _tokenIds.current() <= maxSupply,
            "Can't mint more than max supply"
        );
        uint256 newItemId = _tokenIds.current();
        _mint(tokenOwner, newItemId, count, "");
        return newItemId;
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
        if (!isRevealed) return unRevealedUri;
        if (tokenId <= _tokenIds.current())
            return
                string(abi.encodePacked(baseURI, tokenId.toString(), ".json"));
        else return string(abi.encodePacked(baseURI, "no.json"));
    }

    function setURI(string memory newuri) external onlyOwner {
        baseURI = newuri;
        _setURI(newuri);
    }

    function totalSupply() public view returns (uint256) {
        return _tokenIds.current();
    }

    function setPrice(uint256 _price) external onlyOwner {
        price = _price;
    }

    function setRevealed() public onlyOwner {
        isRevealed = true;
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
