// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract EURC is ERC20 {
    constructor() ERC20("EURC", "EURO Coin") {
        _mint(msg.sender, 1000000000); // 1,000 EURC
    }

    // TODO: Remove this function before deploying to production
    function mint(uint256 amount) external {
        _mint(msg.sender, amount);
    }

    function decimals() public pure override returns (uint8) {
        return 6;
    }
}