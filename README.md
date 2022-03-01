# pixel-devs-ukraine-donation-contract

![Solidity tests](https://github.com/Developer-DAO/pixel-devs-ukraine-donation-contract/actions/workflows/continuous-integration.yaml/badge.svg)

An OpenZeppelin smart contract to support donations to Ukraine DAO for humanitarian efforts.

Donations being sent to: https://twitter.com/Ukraine_DAO/status/1497740751941238784

Based on the Developer DAO Pixel Devs design.

## Deploying

### Deploy to Polygon Mumbai Testnet

- copy `.env.sample` to `.env`
  - add your Ethereum node RPC URL, for example a url from [Alchemy](https://www.alchemy.com/) or another Ethereum node services.
  - add your account private key, for example an account created via MetaMask.
- ensure your account has some MATIC via <https://faucet.polygon.technology/>
- test via `npx hardhat console --network mumbai` and run `accounts = await ethers.provider.listAccounts()` and you should see your public account listed there.
- deploy via `npx hardhat run --network mumbai scripts/deploy.js`
- you should see it now in Polygonscan <https://mumbai.polygonscan.com/> when looking up your public account address used to deploy the contract

### Playing with Contract

Interact with it via the console (`npx hardhat console --network mumbai`)

```
const Donation = await ethers.getContractFactory('PixelDevsUkraineDonation');
const donation = await Donation.attach('<contract address goes here>');
await donation.setBaseURI("ipfs://abc");
```

## Run tests

    npm test
