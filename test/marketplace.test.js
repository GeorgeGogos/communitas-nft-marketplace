const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("EnergyNFTMarketplace", function () {
  let nft, marketplace, owner, buyer;

  beforeEach(async function () {
    [owner, buyer] = await ethers.getSigners();

    const CommunitasNFT = await ethers.getContractFactory("CommunitasNFT");
    nft = await CommunitasNFT.deploy("EnergyNFT", "ENFT");
    await nft.deployed();

    const EnergyNFTMarketplace = await ethers.getContractFactory("EnergyNFTMarketplace");
    marketplace = await upgrades.deployProxy(EnergyNFTMarketplace, [nft.address, owner.address, owner.address]);
    await marketplace.deployed();
  });

  it("Should list and buy an NFT", async function () {
    await nft.createNFT("ipfs://test-metadata");

    await nft.approve(marketplace.address, 0);
    await marketplace.listNFT(0, ethers.utils.parseEther("1"));

    expect(await nft.ownerOf(0)).to.equal(owner.address);

    await marketplace.connect(buyer).buyWithEther(0, { value: ethers.utils.parseEther("1") });
    expect(await nft.ownerOf(0)).to.equal(buyer.address);
  });
});
