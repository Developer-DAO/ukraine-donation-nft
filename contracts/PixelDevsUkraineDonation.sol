// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

// TODO: Remove console import and code for production
import "hardhat/console.sol";

/// @author Developer DAO
/// @title The Pixel Devs Ukraine Donation smart contract that is compliant to ERC721 standard.
contract PixelDevsUkraineDonation is ERC721Enumerable, ReentrancyGuard, Ownable {
    /// TODO: Set this to the IPFS base uri before launch
    string public baseURI =
        "ipfs://";

    uint256 public mintPrice = 12 ether;


    constructor() ERC721("PixelDevsUkraineDonation", "PXLDEV-UKRAINE") {
        console.log("PixelDevsUkraineDonation deployed by '%s'", msg.sender);
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }

    function setMintPrice(uint256 _newPrice) public onlyOwner {
        // Mint price in wei
        mintPrice = _newPrice;
    }

    event LogTokenMinted(address indexed minter, uint256 indexed tokenId);

    function mint(
        uint256 tokenId
    )
        public
        payable
        nonReentrant
    {
        require(mintPrice <= msg.value, "Not enough MATIC sent");
        _safeMint(msg.sender, tokenId);
        emit LogTokenMinted(msg.sender, tokenId);
    }

    function withdraw() public onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }
}
