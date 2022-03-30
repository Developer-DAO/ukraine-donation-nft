// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./@eip2981/ERC2981ContractWideRoyalties.sol";

/// @author Developer DAO
/// @title Developer DAO for Ukraine smart contract that is compliant with ERC721 and ERC2981 standards.
contract DeveloperDAOforUkraine is
    ERC721URIStorage,
    ReentrancyGuard,
    AccessControlEnumerable,
    ERC2981ContractWideRoyalties
{
    using Counters for Counters.Counter;

    string public baseURI =
        "ipfs://QmNpRFikK2XhreaNfEgud8BECpEu3pm3TV9cq5X779MRYE/";
    string public contractURI =
        "ipfs://QmPpNijoDZ4e5VZhdB7vs16EJoi7BumsSizd1UGokh5YaC/";
    bool public contractActive = true;
    mapping(string => uint256) public tiers;
    address public withdrawWallet = 0x633b7218644b83D57d90e7299039ebAb19698e9C;
    bytes32 public constant WITHDRAW_ROLE = keccak256("WITHDRAW_ROLE");
    Counters.Counter private _tokenIds;

    event BaseURIUpdated(string indexed oldValue, string indexed newValue);
    event ContractURIUpdated(string indexed oldValue, string indexed newValue);
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
    event WithdrawWalletUpdated(
        address indexed oldValue,
        address indexed newValue
    );

    constructor() ERC721("Developer DAO for Ukraine", "DEVDAO-UKRAINE") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(WITHDRAW_ROLE, msg.sender);
        setRoyalties(1000); // set royalties to 10%.
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721, AccessControlEnumerable, ERC2981Base)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    function setBaseURI(string memory _newBaseURI)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        emit BaseURIUpdated(baseURI, _newBaseURI);
        baseURI = _newBaseURI;
    }

    function setContractURI(string memory _contractURI)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        emit ContractURIUpdated(contractURI, _contractURI);
        contractURI = _contractURI;
    }

    function setTierPricing(
        uint256 steel,
        uint256 bronze,
        uint256 silver,
        uint256 gold,
        uint256 diamond,
        uint256 platinum
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
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

        _setTokenURI(_token, _tier);
    }

    function withdraw() public onlyRole(WITHDRAW_ROLE) {
        payable(withdrawWallet).transfer(address(this).balance);
    }

    function toggleContractState() public onlyRole(DEFAULT_ADMIN_ROLE) {
        emit ContractStateUpdated(contractActive, !contractActive);
        contractActive = !contractActive;
    }

    function setWithdrawWallet(address _withdrawWallet)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        emit WithdrawWalletUpdated(withdrawWallet, _withdrawWallet);
        withdrawWallet = _withdrawWallet;
    }

    function setRoyalties(uint256 amount) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _setRoyalties(address(this), amount);
    }
}
