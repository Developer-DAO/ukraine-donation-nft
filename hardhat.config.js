require("dotenv").config();
require("@nomiclabs/hardhat-ethers");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

// default values are there to avoid failures when running tests
const POLYGON_MUMBAI_RPC = process.env.POLYGON_MUMBAI_RPC || "1".repeat(32);
const PRIVATE_KEY = process.env.PRIVATE_KEY || "1".repeat(64);

module.exports = {
  solidity: "0.8.9",
  networks: {
    mumbai: {
      url: POLYGON_MUMBAI_RPC,
      accounts: [PRIVATE_KEY],
    },
  },
};
