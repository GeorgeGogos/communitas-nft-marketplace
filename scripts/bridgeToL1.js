require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Using account:", deployer.address);

    const nftL2Address = process.env.NFT_L2_CONTRACT_ADDRESS;
    if (!ethers.isAddress(nftL2Address)) {
        throw new Error("Invalid NFT_L2_CONTRACT_ADDRESS in .env file");
    }

    const tokenId = process.argv[2];
    if (!tokenId) {
        throw new Error("Token ID is required! Usage: node bridgeToL1.js <tokenId>");
    }

    const nftL2 = await ethers.getContractAt("CommunitasNFTL2", nftL2Address);
    console.log(`Bridging NFT ${tokenId} from L2 to L1...`);

    const tx = await nftL2.bridgeToL1(tokenId);
    await tx.wait();

    console.log(`NFT ${tokenId} successfully bridged to L1!`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
