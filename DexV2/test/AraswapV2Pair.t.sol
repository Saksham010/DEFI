// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/core/AraswapV2Pair.sol";
import "./mocks/ERC20Mintable.sol";

contract AraswapV2PairTest is Test{

    ERC20Mintable token0;
    ERC20Mintable token1;
    AraswapV2Pair pair;
    TestUser testUser;

    function initialize() public{
        testUser = new TestUser();

        // Initializing instances
        token0 = new ERC20Mintable("Token A","TKNA");
        token1 = new ERC20Mintable("Token B","TKNB");
        pair = new AraswapV2Pair(address(token0),address(token1));

        // Mint token A and B
        token0.mint(10 ether,address(testUser));
        token1.mint(10 ether,address(testUser));
    }
}