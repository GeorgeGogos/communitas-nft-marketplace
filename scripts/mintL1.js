require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Using account:", deployer.address);

    // Get the NFT contract address from .env
    const nftL1Address = process.env.NFT_L1_CONTRACT_ADDRESS;
    if (!ethers.isAddress(nftL1Address)) {
        throw new Error("Invalid NFT_L1_CONTRACT_ADDRESS in .env file");
    }

    // Get the L1 NFT contract instance
    const nftL1 = await ethers.getContractAt("CommunitasNFTL1", nftL1Address);
    
    // Mint NFT on L1
    console.log("Minting NFT on L1...");
    const tx = await nftL1.mint();
    await tx.wait();

    console.log("NFT Minted Successfully on L1!");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
