# openzeppelin-solidity-hardhat-playground

![Solidity tests](https://github.com/briangershon/openzeppelin-solidity-hardhat-playground/actions/workflows/continuous-integration.yaml/badge.svg)

Develop, test and deploy Solidity contracts based on OpenZeppelin. Use Hardhat development environment. Deploy to Polygon.

Use as a starter template for new Solidity projects.

Initially based on the [OpenZeppelin Learn tutorial](https://docs.openzeppelin.com/learn/).

Also added:

- additional testing features
  - extra [Chai matchers from Waffle](https://ethereum-waffle.readthedocs.io/en/latest/matchers.html) (instead of OpenZeppelin Test Helpers)
  - Github Action to run tests
- scripts in `package.json`
- solhint linter
- configuration to deploy to Polygon Mumbai test network

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
const Box = await ethers.getContractFactory('Box');
const box = await Box.attach('<contract address goes here>');
await box.store(42);
```
