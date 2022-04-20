require('dotenv').config();
require('@nomiclabs/hardhat-ethers');
require('@nomiclabs/hardhat-etherscan');

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

// default values are there to avoid failures when running tests
const POLYGON_MUMBAI_RPC = process.env.POLYGON_MUMBAI_RPC || '1'.repeat(32);
const POLYGON_MAINNET_RPC = process.env.POLYGON_MAINNET_RPC || '1'.repeat(32);
const RINKEBY_RPC = process.env.RINKEBY_RPC || '1'.repeat(32);
const PRIVATE_KEY = process.env.PRIVATE_KEY || '1'.repeat(64);

module.exports = {
    solidity: {
        version: '0.8.9',
        settings: {
            optimizer: {
                enabled: true,
                runs: 1000,
            },
        },
    },
    networks: {
        mumbai: {
            url: POLYGON_MUMBAI_RPC,
            accounts: [PRIVATE_KEY],
        },
        rinkeby: {
            url: RINKEBY_RPC,
            accounts: [PRIVATE_KEY],
        },
        mainnet: {
            url: POLYGON_MAINNET_RPC,
            accounts: [PRIVATE_KEY],
        },
    },
    etherscan: {
        // Your API key for Etherscan. Obtain one at https://etherscan.io/
        apiKey: process.env.ETHERSCAN_API_KEY ?? '',
    },
};
