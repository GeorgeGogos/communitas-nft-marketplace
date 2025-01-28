require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Using account:", deployer.address);

    const nftL1Address = process.env.NFT_L1_CONTRACT_ADDRESS;
    const inboxAddress = process.env.INBOX_ADDRESS;

    if (!ethers.isAddress(nftL1Address) || !ethers.isAddress(inboxAddress)) {
        throw new Error("Invalid NFT_L1_CONTRACT_ADDRESS or INBOX_ADDRESS in .env file");
    }

    const tokenId = process.argv[2];
    if (!tokenId) {
        throw new Error("Token ID is required! Usage: node bridgeToL2.js <tokenId>");
    }

    const nftL1 = await ethers.getContractAt("CommunitasNFTL1", nftL1Address);
    console.log(`Bridging NFT ${tokenId} from L1 to L2...`);

    const tx = await nftL1.bridgeToL2(tokenId, ethers.parseEther("0.01"), 1000000, ethers.parseEther("0.0001"));
    await tx.wait();

    console.log(`NFT ${tokenId} successfully bridged to L2!`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
