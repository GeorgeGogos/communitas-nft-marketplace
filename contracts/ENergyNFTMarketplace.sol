// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {CommunitasNFT} from "./CommunitasNFT.sol";
import {CommunitasNFTL1} from "./L1.sol";
import {CommunitasNFTL2} from "./L2.sol";
import {IInbox} from "@arbitrum/nitro-contracts/src/bridge/IInbox.sol";

contract EnergyNFTMarketplace is OwnableUpgradeable, UUPSUpgradeable {
    CommunitasNFTL1 public nftContractL1;  // L1 NFT contract
    CommunitasNFTL2 public nftContractL2;  // L2 NFT contract
    IERC20 public rewardToken;            // Reward token (ERC20)
    IInbox public inbox;                  // Arbitrum Inbox

    struct Listing {
        uint256 tokenId;
        address seller;
        uint256 priceInRewardTokens;
        uint256 priceInEther;
        bool forSale;
    }

    mapping(uint256 => Listing) public listings;

    event NFTListed(uint256 indexed tokenId, address seller, uint256 priceInRewardTokens, uint256 priceInEther);
    event NFTSold(uint256 indexed tokenId, address buyer, uint256 pricePaid, bool paidWithEther);
    event NFTTransferredToL2(uint256 indexed tokenId, address indexed owner, uint256 ticketId);
    event NFTTransferredToL1(uint256 indexed tokenId, address indexed owner, uint256 withdrawalId);
    event RewardBurned(address indexed user, uint256 amount);

    function initialize(
        address _nftContractL1,
        address _nftContractL2,
        address _rewardToken,
        address _inbox
    ) public initializer {
        __Ownable_init(msg.sender);
        __UUPSUpgradeable_init();
        nftContractL1 = CommunitasNFTL1(_nftContractL1);
        nftContractL2 = CommunitasNFTL2(_nftContractL2);
        rewardToken = IERC20(_rewardToken);
        inbox = IInbox(_inbox);
    }

    /// @notice List an NFT for sale with both Ether and reward token price options
    function listNFT(uint256 tokenId, uint256 priceInRewardTokens, uint256 priceInEther) public {
        require(nftContractL1.ownerOf(tokenId) == msg.sender, "Not NFT owner");
        listings[tokenId] = Listing(tokenId, msg.sender, priceInRewardTokens, priceInEther, true);
        emit NFTListed(tokenId, msg.sender, priceInRewardTokens, priceInEther);
    }

    /// @notice Buy an NFT using Ether
    function buyWithEther(uint256 tokenId) public payable {
        Listing storage listing = listings[tokenId];
        require(listing.forSale, "NFT not for sale");
        require(msg.value >= listing.priceInEther, "Not enough ETH");

        payable(listing.seller).transfer(msg.value);
        nftContractL1.transferFrom(listing.seller, msg.sender, tokenId);
        listing.forSale = false;

        emit NFTSold(tokenId, msg.sender, listing.priceInEther, true);
    }

    /// @notice Buy an NFT using reward tokens, which will be burned upon purchase
    function buyWithRewardTokens(uint256 tokenId) public {
        Listing storage listing = listings[tokenId];
        require(listing.forSale, "NFT not for sale");
        require(rewardToken.balanceOf(msg.sender) >= listing.priceInRewardTokens, "Not enough reward tokens");

        rewardToken.transferFrom(msg.sender, address(this), listing.priceInRewardTokens);
        rewardToken.transfer(address(0), listing.priceInRewardTokens);  // Burn the tokens

        nftContractL1.transferFrom(listing.seller, msg.sender, tokenId);
        listing.forSale = false;

        emit NFTSold(tokenId, msg.sender, listing.priceInRewardTokens, false);
        emit RewardBurned(msg.sender, listing.priceInRewardTokens);
    }

    /// @notice Transfer an NFT from Ethereum (L1) to Arbitrum (L2)
    function transferNFTToL2(
        uint256 tokenId,
        uint256 maxSubmissionCost,
        uint256 maxGas,
        uint256 gasPriceBid
    ) public payable {
        require(nftContractL1.ownerOf(tokenId) == msg.sender, "Not NFT owner");

        // Burn the NFT on L1
        nftContractL1.bridgeToL2{value: msg.value}(
            tokenId,
            maxSubmissionCost,
            maxGas,
            gasPriceBid
        );

        emit NFTTransferredToL2(tokenId, msg.sender, 0);  // Replace 0 with ticket ID if available
    }

    /// @notice Transfer an NFT from Arbitrum (L2) back to Ethereum (L1)
    function transferNFTToL1(uint256 tokenId) public {
        require(nftContractL2.ownerOf(tokenId) == msg.sender, "Not NFT owner");

        // Burn the NFT on L2 and send it back to L1
        uint256 withdrawalId = nftContractL2.bridgeToL1(tokenId);

        emit NFTTransferredToL1(tokenId, msg.sender, withdrawalId);
    }

    /// @notice Ensures only the owner can upgrade the contract
    function _authorizeUpgrade(address) internal override onlyOwner {}
}
