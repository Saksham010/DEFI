// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "../../lib/solmate/src/tokens/ERC20.sol";
import "../../lib/Math.sol";

interface IERC20 {
    function balanceOf(address) external returns (uint256);

    function transfer(address to, uint256 amount) external;
}

contract AraswapV2Pair is ERC20,Math{
    uint256 constant MINIMUM_LIQUIDITY = 1000;

    //Address of the token pairs
    address public token0;
    address public token1;

    //Reserves of token pairs
    uint256 private reserve0;
    uint256 private reserve1;


    // Events
    event Mint(address indexed msg.sender,uint256 amount0,uint256 amount1);
    event Sync(uint256 reserve0,uint256 reserve1);

    //Constructor for LP pair token
    constructor(address _token0, address _token1)ERC20("AraswapV2 Pair","ARPV2",18){
        token0 = _token0;
        token1 = _token1;
    }

    //Get reserves
    function getReserves() public returns(uint256,uint256){
        return(reserve0,reserve1);
    }

    // Update reserves
    function _update(uint256 _balance0, uint256 _balance1){
        reserve0 = _balance0;
        reserve1 = _balance1;
        emit Sync(reserve0,reserve1);
    }

    //Mint LP tokens
    function mint() public{

        (uint256 _reserve0, uint256 _reserve1) = getReserves();
        uint256 balance0 = IERC20(token0).balanceOf(address(this));
        uint256 balance1 = IERC20(token1).balanceOf(address(this));

        // Incomming amount
        uint256 amount0 = balance0 - _reserve0;
        uint256 amount1 = balance1 - _reserve1;

        //Calculating liquidity
        uint256 liquidity;

        if(totalSupply == 0){
            liquidity = Math.sqrt(amount0*amount1) - MINIMUM_LIQUIDITY;
            _mint(address(0),MINIMUM_LIQUIDITY);
        }else{
            liquidity = Math.min(
                (amount0 *totalSupply)/_reserve0,
                (amount1*totalSupply)/_reserve1
            );
        }

        // Minting LP tokens to the lp provider
        _mint(msg.sender,liquidity);
        _update(balance0,balance1);
        emit Mint(msg.sender,amount0,amount1);
        
    }




}