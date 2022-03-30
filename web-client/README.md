# Developer DAO for Ukraine NFT: Web client

This is the VueJS frontend for minting the Developer DAO for Ukraine NFT.

## Installation

### Install all dependencies

```shell
yarn install
```

### Setup `.env`

```shell
cp .env.example .env
```

Fill in the environment variables suitable for your needs.

The example env comes pre-bottled with the Mumbai testnet contract for your convenience.

For a `INFURA_ID` please sign up and grab a free ID here: http://infura.io

### Local development

##### Start local development server

```shell
yarn serve # Starts a server on localhost:8080
```

To lint and prettify all files run:

```shell
yarn style
```

##### Use with local pixel avatar contract

For use with a locally deployed hardhat contract please replace the following env variables:

```dotenv
VUE_APP_CONTRACT_NETWORK_NAME='Hardhat'
VUE_APP_CONTRACT_NETWORK_CHAIN_ID=31337
VUE_APP_CONTRACT_NETWORK_RPC='http://127.0.0.1:8545'
VUE_APP_CONTRACT_TOKEN=[CONTRACT ADDRESS PROVIDED BY HARDHAT]
```

### Production

```shell
yarn install
yarn build # Creates a dist folder
```
