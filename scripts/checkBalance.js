require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Using account:", deployer.address);

    const provider = deployer.provider;
    const ethBalance = await provider.getBalance(deployer.address);
    console.log("ETH Balance:", ethers.formatEther(ethBalance), "ETH");

    const eurcAddress = process.env.REWARD_TOKEN_ADDRESS;
    if (ethers.isAddress(eurcAddress)) {
        const eurc = await ethers.getContractAt("IERC20", eurcAddress);
        const eurcBalance = await eurc.balanceOf(deployer.address);
        console.log("EURC Balance:", ethers.formatUnits(eurcBalance, 6), "EURC");
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
