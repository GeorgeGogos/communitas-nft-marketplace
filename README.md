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
## **4. Compile Smart Contracts**
```bash
npx hardhat run scripts/deployEURC.js --network sepolia
npx hardhat run scripts/deploy.js --network sepolia
```
## **5. Compile Smart Contracts**
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
## **6. Purchase NFTs**
### **Buy NFT with ETH:**
```bash
npx hardhat run scripts/buyNFT.js --network sepolia --tokenId <tokenId> --paymentMethod ether
```
### **Buy NFT with EURC (Reward Token):**
```bash
npx hardhat run scripts/buyNFT.js --network sepolia --tokenId <tokenId> --paymentMethod eurc
```
## **7. Bridge NFTs Between Networks**
### **Transfer NFT from L1 → L2:**
```bash
npx hardhat run scripts/bridgeToL2.js --network sepolia --tokenId <tokenId>
```
### **Transfer NFT from L2 → L1:**
```bash
npx hardhat run scripts/bridgeToL1.js --network arbitrumSepolia --tokenId <tokenId>
```
## **8. Check Wallet Balance**
```bash
npx hardhat run scripts/checkBalance.js --network sepolia
```
## **9. Upload NFT Metadata to IPFS**
```bash
npx hardhat run scripts/uploadToIPFS.js --file path/to/metadata.json
```