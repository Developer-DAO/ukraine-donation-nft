# Polygon Contract

## Run tests

    yarn install
    yarn test

## Run prettier for consistent formatting

    yarn style

## Playing with Contract

Interact with it via the console (`yarn console:mumbai`)

```
accounts = await ethers.provider.listAccounts()
const Donation = await ethers.getContractFactory('DeveloperDAOforUkraine');
const donation = await Donation.attach('<contract address goes here>');
await donation.setBaseURI("ipfs://abc");
```

## Deploy to Polygon Mumbai Testnet

-   copy `.env.sample` to `.env`
    -   add your Polygon node RPC URL, for example a url from [Alchemy](https://www.alchemy.com/) or another Polygon node services.
    -   add your account private key, for example an account created via MetaMask.
-   make sure `DUMMY_PRICING=true` in `.env`
-   ensure your account has some MATIC via <https://faucet.polygon.technology/>
-   deploy via `yarn deploy:mumbai`
-   upload source code via `npx hardhat verify --network mumbai PIXEL_AVATAR_CONTRACT_ADDRESS`
-   you should see it now in Mumbai Polygonscan <https://mumbai.polygonscan.com/> when looking up your public account address used to deploy the contract
-   Upload IPFS metadata. See `../assets/README.md`
-   On <https://mumbai.polygonscan.com/> update:
    -   Run `setContract` to point to IPFS location of contract metadata for OpenSea
    -   Run `setBaseURI` to point to IPFS location that has folder of NFT metadata json files


## Contract Access Control

In this section, we document the contract roles and associated test scenarios for access control. 

### Roles
- Withdraw Role: A user with this role is allowed to call the `withdraw()` function to withdraw funds to the `withdrawWallet` address.
- Admin Role: A user with this role is allowed to call administrative functions as outlined below. 
    - `toggleContractState()`: This function allows an administrator to switch on/off the ability to mint new tokens. 
    - `setWithdrawWallet(address _withdrawWallet)`: This function allows an administrator to change the address to which funds will be withdrawn to via the `withdraw()` function.
    - `setRoyalties(uint256 amount)`: This function allows an administrator to change the royalites percetange for EIP2981 compatible marketplaces. 
    - `setTierPricing(uint256 steel, uint256 bronze, uint256 silver, uint256 gold uint256 diamond, uint256 platinum)` : This function allows an administrator to set the price for each NFT tier.
    - `setContractURI(string memory _contractURI)`: This function allows an administrator to set storefront level metadata as defined in [OpenSea's Documentation](https://docs.opensea.io/docs/contract-level-metadata)
    - `setBaseURI(string memory _newBaseURI)`: This function allows an administrator to set contract level metadata. 

### ⚠️ ⚠️ Important Scenario For Administrators

#### 
- When the contract is deployed, the deployer is given the `admin` and `withdraw` roles.
- Any user with the `admin` role can assign `admin` and `withdraw` roles to another user with the `grantRole(bytes32 role, address account)` function and appropriate parameters.
- Any user with the `admin` role can revoke `admin` and `withdraw` roles from any user including themselves with the `revokeRole(bytes32 role, address account)` function and appropriate parameters. 
- Any user can revoke their own roles with `renounceRole(bytes32 role, address account)`. This is handy if a user has the `withdraw` role but no `admin` role and their account has been compromised. The `revokeRole(...)` function can only be called by an administrator, so they'd need to use `renounceRole(...)` to revoke their permissions. 
- If there is a single `admin` user on the contract and they revoke their administrator privilege, then functions that require the `admin` role cannot be executed. Given this, it is important to ensure that there is an authorized user with `withdraw` role and that the `withdrawWallet` is set appropriately before the administrator revokes their own privileges. 


