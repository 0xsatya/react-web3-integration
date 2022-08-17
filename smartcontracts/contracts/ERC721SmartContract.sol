// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";


contract ERC721SmartContract is ERC721, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    uint256 public maxSupply;
    string private baseURI;
    using Strings for uint256;

    constructor(string memory name, string memory symbol, uint256 _maxSupply, string memory _uri) ERC721(name, symbol) {
        maxSupply = _maxSupply;
        baseURI = _uri;
    }

    function mint(address tokenOwner)
        public
        nonReentrant
        returns (uint256)
    {
        _tokenIds.increment();
        require(_tokenIds.current() <= maxSupply, "Can't mint more than max supply");
        uint256 newItemId = _tokenIds.current();
        _mint(tokenOwner, newItemId);
        return newItemId;
    }

    //return tokenURI for the minted tokens
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory)
    {
        require(_exists(tokenId), "ERC721SmartContract: URI query for nonexistent token");
        string memory currentBaseURI = _baseURI();

        return bytes(currentBaseURI).length > 0 ?
            string(abi.encodePacked(currentBaseURI, tokenId.toString()))
            : "";
    }

    //sets baseURI
    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }

    //return baseURI for the collection
    function getBaseURI() public view returns (string memory) {
        return _baseURI();
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }
}
