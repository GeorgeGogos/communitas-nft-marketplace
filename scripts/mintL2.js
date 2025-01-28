require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Using account:", deployer.address);

    // Get the NFT contract address from .env
    const nftL2Address = process.env.NFT_L2_CONTRACT_ADDRESS;
    if (!ethers.isAddress(nftL2Address)) {
        throw new Error("Invalid NFT_L2_CONTRACT_ADDRESS in .env file");
    }

    // Get the L2 NFT contract instance
    const nftL2 = await ethers.getContractAt("CommunitasNFTL2", nftL2Address);
    
    // Mint NFT on L2
    console.log("Minting NFT on L2...");
    const tx = await nftL2.mint();
    await tx.wait();

    console.log("NFT Minted Successfully on L2!");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
