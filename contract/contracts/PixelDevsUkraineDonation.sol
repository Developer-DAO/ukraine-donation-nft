// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/// @author Developer DAO
/// @title The Pixel Devs Ukraine Donation smart contract that is compliant to ERC721 standard.
contract PixelDevsUkraineDonation is
    ERC721URIStorage,
    ReentrancyGuard,
    Ownable
{
    using Counters for Counters.Counter;

    string public baseURI =
        "ipfs://QmZiCUXCytbbnqCzJAujXLxeQS7MkE9TJKyYbV6LjSinN4/";
    bool public contractActive = true;
    mapping(string => uint256) public tiers;
    Counters.Counter private _tokenIds;

    event BaseURIUpdated(string indexed oldValue, string indexed newValue);
    event ContractStateUpdated(bool indexed oldValue, bool indexed newValue);
    event LogTokenMinted(
        address indexed minter,
        uint256 indexed tokenId,
        string indexed tier
    );
    event TierPricingUpdated(
        string indexed tier,
        uint256 indexed oldValue,
        uint256 indexed newValue
    );

    constructor() ERC721("PixelDevsUkraineDonation", "PXLDEV-UKRAINE") {
        //
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        emit BaseURIUpdated(baseURI, _newBaseURI);
        baseURI = _newBaseURI;
    }

    function setTierPricing(
        uint256 steel,
        uint256 bronze,
        uint256 silver,
        uint256 gold,
        uint256 diamond,
        uint256 platinum
    ) public onlyOwner {
        emit TierPricingUpdated("steel", tiers["steel"], steel);
        emit TierPricingUpdated("bronze", tiers["bronze"], bronze);
        emit TierPricingUpdated("silver", tiers["silver"], silver);
        emit TierPricingUpdated("gold", tiers["gold"], gold);
        emit TierPricingUpdated("diamond", tiers["diamond"], diamond);
        emit TierPricingUpdated("platinum", tiers["platinum"], platinum);

        tiers["steel"] = steel;
        tiers["bronze"] = bronze;
        tiers["silver"] = silver;
        tiers["gold"] = gold;
        tiers["diamond"] = diamond;
        tiers["platinum"] = platinum;
    }

    function mint() public payable nonReentrant {
        require(
            msg.value >= tiers["steel"],
            "Please send enough MATIC to meet the minimum threshold of a tier."
        );
        require(
            contractActive,
            "This contract has been deactivated by the owner and does not currently accept anymore donations."
        );

        _tokenIds.increment();
        uint256 _token = _tokenIds.current();
        _safeMint(msg.sender, _token);

        string memory _tier = "steel";

        if (msg.value >= tiers["platinum"]) {
            _tier = "platinum";
        } else if (msg.value >= tiers["diamond"]) {
            _tier = "diamond";
        } else if (msg.value >= tiers["gold"]) {
            _tier = "gold";
        } else if (msg.value >= tiers["silver"]) {
            _tier = "silver";
        } else if (msg.value >= tiers["bronze"]) {
            _tier = "bronze";
        }

        emit LogTokenMinted(msg.sender, _token, _tier);

        _setTokenURI(_token, string(bytes.concat(bytes(_tier), bytes(".png"))));
    }

    function withdraw() public onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }

    function toggleContractState() public onlyOwner {
        contractActive = !contractActive;
        emit ContractStateUpdated(!contractActive, contractActive);
    }
}
