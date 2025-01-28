require("dotenv").config();
const { ethers, upgrades } = require("hardhat");
const fs = require("fs");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with account:", deployer.address);

    // Check account balance
    const provider = deployer.provider;
    const balance = await provider.getBalance(deployer.address);
    console.log("Account balance:", ethers.formatEther(balance), "ETH");

    if (balance < ethers.parseEther("0.1")) {
        throw new Error("Insufficient funds! Ensure you have at least 0.1 ETH.");
    }

    // Load Inbox and Outbox Addresses from .env
    const inboxAddress = process.env.INBOX_ADDRESS;
    const outboxAddress = process.env.OUTBOX_ADDRESS;
    const rewardTokenAddress = process.env.REWARD_TOKEN_ADDRESS;

    if (!ethers.isAddress(inboxAddress) || !ethers.isAddress(outboxAddress) || !ethers.isAddress(rewardTokenAddress)) {
        throw new Error("Invalid INBOX_ADDRESS, OUTBOX_ADDRESS, or REWARD_TOKEN_ADDRESS in .env file");
    }

    console.log("Deploying CommunitasNFTL1...");

    // Deploy CommunitasNFTL1 with a placeholder L2 address
    const CommunitasNFTL1 = await ethers.getContractFactory("CommunitasNFTL1");
    const nftL1 = await CommunitasNFTL1.deploy(ethers.ZeroAddress, inboxAddress);
    await nftL1.waitForDeployment();
    const nftL1Address = await nftL1.getAddress();
    console.log("NFT L1 Contract deployed to:", nftL1Address);

    // Deploy CommunitasNFTL2 with the L1 contract address
    console.log("Deploying CommunitasNFTL2...");
    const nftL2 = await CommunitasNFTL2.deploy(nftL1Address);
    await nftL2.waitForDeployment();
    const nftL2Address = await nftL2.getAddress();
    console.log("NFT L2 Contract deployed to:", nftL2Address);

    // Update the L1 contract with the deployed L2 contract address
    console.log("Updating L1 contract with L2 contract address...");
    const tx = await nftL1.updatel2Target(nftL2Address);
    await tx.wait();
    console.log("L1 contract updated successfully.");

    // Deploy EnergyNFTMarketplace contract with required arguments
    console.log("Deploying EnergyNFTMarketplace...");
    const EnergyNFTMarketplace = await ethers.getContractFactory("EnergyNFTMarketplace");
    const marketplace = await upgrades.deployProxy(EnergyNFTMarketplace, [
        nftL1Address,
        nftL2Address,
        rewardTokenAddress,
        inboxAddress,
        outboxAddress,
    ]);

    await marketplace.waitForDeployment();
    const marketplaceAddress = await marketplace.getAddress();
    console.log("Marketplace Contract deployed to:", marketplaceAddress);

    // Update .env file with deployed contract addresses
    updateEnvFile(nftL1Address, nftL2Address, marketplaceAddress);
}

// Function to update .env file with deployed contract addresses
function updateEnvFile(nftL1Address, nftL2Address, marketplaceAddress) {
    let envContent = fs.readFileSync(".env", "utf8");

    envContent = envContent.replace(
        /NFT_L1_CONTRACT_ADDRESS=.*/,
        `NFT_L1_CONTRACT_ADDRESS=${nftL1Address}`
    );

    envContent = envContent.replace(
        /NFT_L2_CONTRACT_ADDRESS=.*/,
        `NFT_L2_CONTRACT_ADDRESS=${nftL2Address}`
    );

    envContent = envContent.replace(
        /MARKETPLACE_CONTRACT_ADDRESS=.*/,
        `MARKETPLACE_CONTRACT_ADDRESS=${marketplaceAddress}`
    );

    fs.writeFileSync(".env", envContent);
    console.log("\n.env file updated with new contract addresses.");
}

main().catch((error) => {
    console.error("Error during deployment:", error);
    process.exitCode = 1;
});
