# Polygon Contract

## Run tests

    yarn install
    yarn test

## Playing with Contract

Interact with it via the console (`npx hardhat console --network mumbai`)

```
const Donation = await ethers.getContractFactory('PixelDevsUkraineDonation');
const donation = await Donation.attach('<contract address goes here>');
await donation.setBaseURI("ipfs://abc");
```

## Deploy to Polygon Mumbai Testnet

- copy `.env.sample` to `.env`
  - add your Polygon node RPC URL, for example a url from [Alchemy](https://www.alchemy.com/) or another Polygon node services.
  - add your account private key, for example an account created via MetaMask.
- ensure your account has some MATIC via <https://faucet.polygon.technology/>
- test via `npx hardhat console --network mumbai` and run `accounts = await ethers.provider.listAccounts()` and you should see your public account listed there.
- deploy via `npx hardhat run --network mumbai scripts/deploy.js`
- you should see it now in Mumbai Polygonscan <https://mumbai.polygonscan.com/> when looking up your public account address used to deploy the contract
