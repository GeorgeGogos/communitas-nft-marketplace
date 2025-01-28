require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying EURC with account:", deployer.address);

    // Deploy the EURC contract
    const EURC = await ethers.getContractFactory("EURC");
    const eurc = await EURC.deploy();
    await eurc.waitForDeployment();

    const eurcAddress = await eurc.getAddress();
    console.log("EURC Token deployed to:", eurcAddress);
}

main().catch((error) => {
    console.error("Error during deployment:", error);
    process.exitCode = 1;
});
