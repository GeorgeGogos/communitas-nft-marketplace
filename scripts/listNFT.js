require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Using account:", deployer.address);

    const marketplaceAddress = process.env.MARKETPLACE_CONTRACT_ADDRESS;
    if (!ethers.isAddress(marketplaceAddress)) {
        throw new Error("Invalid MARKETPLACE_CONTRACT_ADDRESS in .env file");
    }

    const tokenId = process.argv[2];
    const priceInEurc = process.argv[3];
    const priceInEther = process.argv[4];

    if (!tokenId || !priceInEurc || !priceInEther) {
        throw new Error("Usage: node listNFT.js <tokenId> <priceInEurc> <priceInEther>");
    }

    const marketplace = await ethers.getContractAt("EnergyNFTMarketplace", marketplaceAddress);
    const tx = await marketplace.listNFT(tokenId, ethers.parseUnits(priceInEurc, 6), ethers.parseEther(priceInEther));
    await tx.wait();

    console.log(`NFT ${tokenId} listed for ${priceInEurc} EURC or ${priceInEther} ETH.`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
