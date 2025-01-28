require("@nomiclabs/hardhat-ethers");
require("@openzeppelin/hardhat-upgrades");
require("dotenv").config();

module.exports = {
    solidity: "0.8.24",
    networks: {
        sepolia: {
            url: process.env.ETHEREUM_RPC_URL,
            accounts: [process.env.PRIVATE_KEY],
        },
        arbitrumSepolia: {
            url: process.env.ARBITRUM_RPC_URL,
            accounts: [process.env.PRIVATE_KEY],
        },
    },
};
