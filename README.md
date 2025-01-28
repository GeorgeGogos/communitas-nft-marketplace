# **Commands for NFT Marketplace**

---

## **1. Clone the Repository** 
```bash
git clone https://github.com/GeorgeGogos/communitas-nft-marketplace.git
cd communitas-nft-marketplace
```
## **2. Install Dependencies**
```bash
npm install
```
## **3. Compile Smart Contracts**
```bash
npx hardhat compile
```
## **4. Environment Variables**

Before running the project, create a `.env` file in the root of your project and include the following values:

```ini
# 🔹 Infura or Alchemy API keys
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
ARBITRUM_SEPOLIA_RPC_URL=https://arbitrum-sepolia.infura.io/v3/YOUR_INFURA_KEY

# 🔹 Wallet Private Key (DO NOT SHARE)
PRIVATE_KEY=your_private_key_here

# 🔹 Arbitrum Inbox/Outbox Addresses (for bridging NFTs)
INBOX_ADDRESS=0x339f7296e4ff4a48f7339c2e88f01c94a3561d8a
OUTBOX_ADDRESS=0xca8cfffdb036076d0e805cd10abd2b2316d0a67f

# 🔹 Contract Addresses (Filled after deployment)
NFT_L1_CONTRACT_ADDRESS=
NFT_L2_CONTRACT_ADDRESS=
MARKETPLACE_CONTRACT_ADDRESS=
REWARD_TOKEN_ADDRESS=
```

## **5. Compile Smart Contracts**
```bash
npx hardhat run scripts/deployEURC.js --network sepolia
npx hardhat run scripts/deploy.js --network sepolia
```
## **6. Compile Smart Contracts**
### **Mint an NFT on Ethereum Sepolia (L1):**
```bash
npx hardhat run scripts/mintL1.js --network sepolia
```
### **Mint an NFT on Arbitrum Sepolia (L2):**
```bash
npx hardhat run scripts/mintL2.js --network arbitrumSepolia
```
### **List an NFT for Sale:**
```bash
npx hardhat run scripts/listNFT.js --network sepolia --tokenId <tokenId> --priceInEurc <priceInEurc> --priceInEther <priceInEther>
```
## **7. Purchase NFTs**
### **Buy NFT with ETH:**
```bash
npx hardhat run scripts/buyNFT.js --network sepolia --tokenId <tokenId> --paymentMethod ether
```
### **Buy NFT with EURC (Reward Token):**
```bash
npx hardhat run scripts/buyNFT.js --network sepolia --tokenId <tokenId> --paymentMethod eurc
```
## **8. Bridge NFTs Between Networks**
### **Transfer NFT from L1 → L2:**
```bash
npx hardhat run scripts/bridgeToL2.js --network sepolia --tokenId <tokenId>
```
### **Transfer NFT from L2 → L1:**
```bash
npx hardhat run scripts/bridgeToL1.js --network arbitrumSepolia --tokenId <tokenId>
```
## **9. Check Wallet Balance**
```bash
npx hardhat run scripts/checkBalance.js --network sepolia
```
## **10. Upload NFT Metadata to IPFS**
```bash
npx hardhat run scripts/uploadToIPFS.js --file path/to/metadata.json
```