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
    uint112 private reserve0;
    uint112 private reserve1;

    // Last swap timestamp
    uint32 private blockTimestampLast;

    // Price calculation
    uint256 public price0CumulativeLast;
    uint256 public price1CumulativeLast;


    // Events
    event Mint(address indexed sender,uint256 amount0,uint256 amount1);
    event Sync(uint112 reserve0,uint112 reserve1);
    event Burn(address indexed sender, uint256 amount0, uint256 amount1);
    event Swap(address indexed sender, uint256 amount0out, uint256 amount1out,address to);

    //Constructor for LP pair token
    constructor(address _token0, address _token1)ERC20("AraswapV2 Pair","ARPV2",18){
        token0 = _token0;
        token1 = _token1;
    }

    
    //Get reserves
    function getReserves() public returns(uint112,uint112){
        return(reserve0,reserve1);
    }

    // Update reserves
    function _update(uint256 _balance0, uint256 _balance1)private{
        reserve0 = uint112(_balance0);
        reserve1 = uint112(_balance1);
        emit Sync(reserve0,reserve1);
    }

    // Swap update
    function _update_(uint256 _balance0, uint256 _balance1, uint112 _reserve0, uint112 _reserve1)private{
        
        unchecked{
            // Time elapsed after the last swap
            uint32 timeElapsed = uint32(block.timestamp) - blockTimestampLast;

            if(timeElapsed >0 && _reserve0 > 0 && reserve1 > 0){
                price0CumulativeLast += uint256(UQ112x112.encode(_reserve1).uqdiv(_reserve0))*timeElapsed;
                price1CumulativeLast += uint256(UQ112x112.encode(_reserve0).uqdiv(_reserve1))*timeElapsed;
            
            }
        }

        
        reserve0 = uint112(_balance0);
        reserve1 = uint112(_balance1);
        blockTimestampLast = uint32(block.timestamp);
        emit Sync(reserve0,reserve1);
    }

    //Mint LP tokens
    function mint() public{

        (uint112 _reserve0, uint112 _reserve1) = getReserves();
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

    // Removing liquidity 
    function burn() public{
        // Get the latest reserve
        uint256 balance0 = IERC20(token0).balanceOf(address(this));
        uint256 balance1 = IERC20(token1).balanceOf(address(this));
        uint256 liquidity = balanceOf[msg.sender];  //Amount of LP tokens held by the user
        // Amount of token that user should get
        uint256 amount0 =  (balance0 * liquidity)/totalSupply;
        uint256 amount1 = (balance1 * liquidity)/totalSupply;

        if(amount0 <= 0 || amount1 <= 0){
            revert("Insufficient liquidity burn amount");
        }

        //Burning liquidity
        _burn(msg.sender,liquidity);

        //Transferring the token amounts
        _safeTransfer(token0,msg.sender,amount0);
        _safeTransfer(token1,msg.sender,amount1);

        // Getting latest reserve and updating it
        balance0 = IERC20(token0).balanceOf(address(this));
        balance1 = IERC20(token1).balanceOf(address(this));

        _update(balance0,balance1);

        emit Burn(msg.sender,amount0,amount1);

    }

    // Swap
    function swap(amount0out, amount1out, to) public{

        //Output amount checks
        if(amount0out <=0 || amount1out <=0){
            revert("Insufficient amounts");
        }

        // Reserves
        (uint112 r0, uint112 r0) = getReserves();

        //Check if the ouput amount is greater than reserves
        if(amount0out > r0 || amount1out > r1){
            revert("Amount is greater than the reserves");
        }

        //Estimated balance of the contract after swap
        uint256 _balance0 = IERC20(token0).balanceOf(address(this)) - amount0out;
        uint256 _balance1 = IERC20(token1).balanceOf(address(this)) - amount1out;

        // Check to ensure that the product of reserves are equal or greater than k
        if((r0 * r1) > (_balance0 * _balance1)){
            revert("Invalid amounts");
        }

        // Update reserve (swap)
        _update_(_balance0,_balance1);

        // Transfer token
        if(amount0out > 0){
            _safeTransfer(token0,to,amount0out);
        }
        if(amount1 > 0 ){
            _safeTransfer(token1,to,amount1out);
        }

        //Emitting event
        emit Swap(msg.sender,amount0out,amount1out,to);

    }


    // Safe transfer
    function _safeTransfer(address token, address to, uint256 amount) private{
        (bool success, bytes memory data) =  token.call(abi.encodeWithSignature("transfer(address,uint256)",to,amount));
        if(!success || (data.length != 0 && !abi.decode(data,(bool)))){
            revert("Transfer fail");
        }
    }


}