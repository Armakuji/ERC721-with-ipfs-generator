// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MintNFT is ERC721, ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    uint256 public constant MAX_SUPPLY = 3;
    uint256 private constant MINT_COST = 0.1 ether;
    string _baseURIextended;

    constructor(
        string memory name,
        string memory symbol,
        string memory initBaseURI
    ) ERC721(name, symbol) {
        setBaseURI(initBaseURI);
    }

    function setBaseURI(string memory newBaseURI) public onlyOwner {
        _baseURIextended = newBaseURI;
    }

    function mint(address to) public payable {
        uint256 tokenId = _tokenIdCounter.current();
        require(tokenId < MAX_SUPPLY, 'Exceed the maximum supply');
        require(msg.value >= MINT_COST, 'Not enough funds');
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
    }

    function withdraw() public onlyOwner {
        uint balance = address(this).balance;
        payable(msg.sender).transfer(balance);
    }

   
    //internal override baseURI
    function _baseURI() internal view virtual override returns(string memory){
        return _baseURIextended;
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
