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
