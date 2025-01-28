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
    const paymentMethod = process.argv[3]; // "ether" or "eurc"
    if (!tokenId || !paymentMethod) {
        throw new Error("Usage: node buyNFT.js <tokenId> <ether/eurc>");
    }

    const marketplace = await ethers.getContractAt("EnergyNFTMarketplace", marketplaceAddress);

    if (paymentMethod === "ether") {
        const listing = await marketplace.listings(tokenId);
        const tx = await marketplace.buyWithEther(tokenId, { value: listing.priceInEther });
        await tx.wait();
        console.log(`NFT ${tokenId} purchased with ETH!`);
    } else if (paymentMethod === "eurc") {
        const tx = await marketplace.buyWithRewardTokens(tokenId);
        await tx.wait();
        console.log(`NFT ${tokenId} purchased with EURC!`);
    } else {
        console.error("Invalid payment method. Use 'ether' or 'eurc'.");
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
