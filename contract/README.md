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

## Deploy to Rinkeby for Testing Royalties on OpenSea

You need to deploy contract to Rinkeby to manually test royalty payments. Mumbai uses MATIC and there doesn't seem to be a way to wrap this on OpenSea on their testnet. You can work with ETH throughout via Rinkeby.

Unfortunately means we're not testing on the actual Polygon chain, but is a workaround.

Get test ETH at <https://rinkebyfaucet.com>. Login via Alchemy to receive 0.5 ETH per transaction.

Follow "Deploy to Polygon" instructions above but make sure you set `RINKEBY_RPC` env variable and use `yarn deploy:rinkeby` and `npx hardhat verify --network rinkeby PIXEL_AVATAR_CONTRACT_ADDRESS`

Visit contract at <https://rinkeby.etherscan.io/>

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

### Important Scenario - Revoking Administrator Access ⚠️ ⚠️ 

- When the contract is deployed, the deployer is given the `admin` and `withdraw` roles.
- Any user with the `admin` role can assign `admin` and `withdraw` roles to another user with the `grantRole(bytes32 role, address account)` function and appropriate parameters.
- Any user with the `admin` role can revoke `admin` and `withdraw` roles from any user including themselves with the `revokeRole(bytes32 role, address account)` function and appropriate parameters. 
- Any user can revoke their own roles with `renounceRole(bytes32 role, address account)`. This is handy if a user has the `withdraw` role but no `admin` role and their account has been compromised. The `revokeRole(...)` function can only be called by an administrator, so they'd need to use `renounceRole(...)` to revoke their permissions. 
- If there is a single `admin` user on the contract and they revoke their administrator privilege, then functions that require the `admin` role cannot be executed. Given this, it is important to ensure that there is an authorized user with `withdraw` role and that the `withdrawWallet` is set appropriately before the administrator revokes their own privileges. 


### Tests

#### Admin Role Tests 

#### Multiple Admin Users
- Scenario: Allow multiple users to have `admin` role on the contract. 
- Unit Test: Included in DevelopDAOforUkraine.test.js (when assigning default admin role, should allow more than one user to have the default admin role).
- Mumbai Network Test Information: 
    - [Mumbai Test Contract Polygon Scan Link](https://mumbai.polygonscan.com/address/0x1896C79732e4DF5067EC59e59Bc7D12d3577436B).
    - Granted other account `admin` role successfully through `grantRole(bytes32 role, address account)` [Mumbai Test Transaction Polygon Scan Link](https://mumbai.polygonscan.com/tx/0x28b1a494757f17049dec992d4f6ce3f0e339f16a1338cb7c5fe1a8de87e0843f).
    - Confirmed through `getRoleMemberCount(bytes32 role)` and `getRoleMember(bytes32 role, uint256 index)` that 2 `admin` users exist on the contract. 

#### Multiple Withdraw Users
- Scenario: Allow multiple users to have `withdraw` role on the contract. 
- Unit Test: Included in DevelopDAOforUkraine.test.js (when assigning withdraw role, should allow more than one user to have the withdraw role).
- Mumbai Network Test Information: 
    - [Mumbai Test Contract Polygon Scan Link](https://mumbai.polygonscan.com/address/0x1896C79732e4DF5067EC59e59Bc7D12d3577436B).
    - Granted other account `withdraw` role successfully through `grantRole(bytes32 role, address account)` [Mumbai Test Transaction Polygon Scan Link](https://mumbai.polygonscan.com/tx/0x9d9fb155501c06dd837bd47ac04c698273c891abd9a8eb45c7a8b3e332206e80).
    - Confirmed through `getRoleMemberCount(bytes32 role)` and `getRoleMember(bytes32 role, uint256 index)` that 2 `withdraw` users exist on the contract. 

#### Revoke Withdraw Role 
- Scenario: Revoke a user with `withdraw` role on the contract. 
- Unit Test: Included in DevelopDAOforUkraine.test.js (when revoking withdraw role, should succeed if executing user has default admin role.).
- Mumbai Network Test Information: 
    - [Mumbai Test Contract Polygon Scan Link](https://mumbai.polygonscan.com/address/0x1896C79732e4DF5067EC59e59Bc7D12d3577436B).
    - Revoked other account `withdraw` role successfully through `revokeRole(bytes32 role, address account)` [Mumbai Test Transaction Polygon Scan Link](https://mumbai.polygonscan.com/tx/0xdc5fd35fcd6eee2672b592eeb680cd70b3606b6d664e9c81c48ca8e474b5e18b).
    - Confirmed through `getRoleMemberCount(bytes32 role)` and `getRoleMember(bytes32 role, uint256 index)` that 1 `withdraw` user exists on the contract. 

#### Revoke Admin Role 
- Scenario: Revoke a user with `admin` role on the contract. 
- Unit Test: Included in DevelopDAOforUkraine.test.js (when revoking default admin role, should succeed if executing user has default admin role.).
- Mumbai Network Test Information: 
    - [Mumbai Test Contract Polygon Scan Link](https://mumbai.polygonscan.com/address/0x1896C79732e4DF5067EC59e59Bc7D12d3577436B).
    - Revoked other account `admin` role successfully through `revokeRole(bytes32 role, address account)` [Mumbai Test Transaction Polygon Scan Link](https://mumbai.polygonscan.com/tx/0xc6e27058ddef95042523097481c8c492d1e824a15949a1b500daaee3fad15a99).
    - Confirmed through `getRoleMemberCount(bytes32 role)` and `getRoleMember(bytes32 role, uint256 index)` that 1 `admin` user exists on the contract. 
