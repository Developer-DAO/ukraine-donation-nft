// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

// import "hardhat/console.sol";

/// @author Developer DAO
/// @title The Pixel Devs Ukraine Donation smart contract that is compliant to ERC721 standard.
contract PixelDevsUkraineDonation is
    ERC721URIStorage,
    ReentrancyGuard,
    Ownable
{
    using Counters for Counters.Counter;

    /// TODO: Set this to the IPFS base uri before launch
    string public baseURI = "ipfs://abcd.../";
    uint256 public minimumMintPrice = 12 ether;
    bool public contractState = true;
    address public withdrawWallet; 
    Counters.Counter private _tokenIds;

    event LogTokenMinted(
        address indexed minter,
        uint256 indexed tokenId,
        string indexed donationType
    );
    event BaseURIUpdated(string indexed oldValue, string indexed newValue);
    event MinimumMintPriceUpdated(
        uint256 indexed oldValue,
        uint256 indexed newValue
    );
    event ContractStateUpdated(bool indexed oldValue, bool indexed newValue);
    event WithdrawWalletUpdated(address indexed oldValue, address indexed newValue);

    constructor(address _withdrawWallet) ERC721("PixelDevsUkraineDonation", "PXLDEV-UKRAINE") {
        withdrawWallet = _withdrawWallet;
        // console.log("PixelDevsUkraineDonation deployed by '%s'", msg.sender);
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        emit BaseURIUpdated(baseURI, _newBaseURI);
        baseURI = _newBaseURI;
    }

    function setMinimumMintPrice(uint256 _newPrice) public onlyOwner {
        // Mint price in wei
        emit MinimumMintPriceUpdated(minimumMintPrice, _newPrice);
        minimumMintPrice = _newPrice;
    }

    function mint() public payable nonReentrant {
        require(minimumMintPrice <= msg.value, "Not enough MATIC sent");
        require(contractState, "Contract must be active to mint");

        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        _safeMint(msg.sender, newTokenId);

        string memory donationType = "platinum";

        if (msg.value <= 25 ether) {
            donationType = "bronze";
        } else if (msg.value <= 50 ether) {
            donationType = "silver";
        } else if (msg.value <= 100 ether) {
            donationType = "gold";
        } else if (msg.value <= 500 ether) {
            donationType = "diamond";
        }

        emit LogTokenMinted(msg.sender, newTokenId, donationType);
        _setTokenURI(newTokenId, donationType);
    }

    function withdraw() public onlyOwner {
        payable(withdrawWallet).transfer(address(this).balance);
    }

    function switchContractState() public onlyOwner {
        contractState = !contractState;
        emit ContractStateUpdated(!contractState, contractState);
    }

    function setWithdrawWallet(address _withdrawWallet) public onlyOwner {
        emit WithdrawWalletUpdated(withdrawWallet, _withdrawWallet);
        withdrawWallet = _withdrawWallet;
    }
}
