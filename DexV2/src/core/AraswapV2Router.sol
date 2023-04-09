// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "./AraswapV2Library.sol";

interface IAraswapV2Factory{
    function createPair(address tokenA, address tokenB)external returns(address);

}
interface IAraswapPair{
    function mint(address) external returns(uint256);
    function transferFrom(address,address,uint256)external;
}

contract AraswapV2Router{

    IAraswapV2Factory factory;

    constructor(address _factoryContract){
        factory = IAraswapV2Factory(_factoryContract);
    }   

    //Calculate amount to be depostied
    function calculateLiquidity(address tokenA,address tokenB,uint256 amountADesired, uint256 amountBDesired, uint256 amountAmin,uint256 amountBmin) internal returns (uint256 amountA, uint256 amountB){

        // Check if the reserves are empty. If the reserves are empty -> then desired amount is used
        (uint112 reserveA, uint112 reserveB) = AraswapV2Library.getReserves(address(factory),tokenA,tokenB);

        if(reserveA == 0 && reserveB == 0 ){
            // Set amount as max amounts
            (amountA,amountB) = (amountADesired,amountBDesired);
        }
        // If not empty calculate optimal amount. Optimal amount is >= minimum amount and <= max desired amount
        else{
            uint256 amountBoptimal = AraswapV2Library.quote(amountADesired,reserveA,reserveB);

            if(amountBoptimal <= amountBDesired){
                if(amountBoptimal <= amountBmin){
                    revert("Insufficent amount B");
                }
                (amountA,amountB) = (amountADesired,amountBoptimal);
            }else{

                uint256 amountAoptimal = AraswapV2Library.quote(amountBDesired,reserveB,reserveA);

                if(amountAoptimal <= amountADesired){
                    if(amountAoptimal <= amountAmin){
                        revert("Insufficent amount A");
                    }
                    (amountA,amountB) = (amountAoptimal,amountBDesired);
                }
            }

        }
    }

    function addLiquidity(address tokenA,address tokenB,uint256 amountADesired, uint256 amountBDesired, uint256 amountAMin,uint256 amountBmin, address to) public returns(uint256 amountA,uint256 amountB,uint256 liquidity){

        // Check if the pair exists or not
        if(factory.pairs(tokenA,tokenB) == address(0)){
            // If it does not exists create a token pair
            factory.createPair(tokenA,tokenB);
        }

        // Calculate the amounts that will be deposited
        (amountA, amountB) = calculateLiquidity(tokenA,tokenA,amountADesired,amountBDesired,amountAMin,amountBmin);

        // Pair address
        address pairAddress = AraswapV2Library.pairFor(address(factory),tokenA,tokenB);

        // Transfer token A and token B to the pair contract
        _safeTransfer(tokenA,msg.sender,pairAddress,amountA);
        _safeTransfer(tokenB,msg.sender,pairAddress,amountB);

        // Add liquidity
        liquidity = IAraswapPair(pairAddress).mint(to);
        
    }

    function _safeTransferFrom(
        address token,
        address from,
        address to,
        uint256 value
    ) private {
        (bool success, bytes memory data) = token.call(
            abi.encodeWithSignature(
                "transferFrom(address,address,uint256)",
                from,
                to,
                value
            )
        );
        if (!success || (data.length != 0 && !abi.decode(data, (bool))))
            revert SafeTransferFailed();
    }

    // Remove liquidity
    function removeLiquidity(address tokenA, address tokenB,uint256 liquidity,uint256 minA, uint256 minB, address to) public{

        // Find pair address
        address pairAddress = AraswapV2Library.pairFor(address(factory),tokenA,tokenB);

        // Send LP tokens from User to pair contract to burn the LP tokens
        IAraswapPair(pairAddress).transferFrom(msg.sender,pairAddress,liquidity);
        // Calling burn function
        (uint256 amount0, uint256 amount1) = IAraswapPair(pairAddress).burn(to);

        // Check if the amount received by the user is greater than minimum tokens or not
        if(amount0 < minA || amount1 < minB){
            revert("Insufficient amount to receive while removing liquidity");
        }

    }


    // Get output amount
    function getOutputAmount(uint256 reserveIn, uint256 reserveOut, uint256 amountIn) public returns(uint256 outAmount) {

        // Assuming 0.3% fee, r = 1-fees = 1-3% ==> 0.97
        //  input amount with fees => input amount * r => inputamount * 0.97

        // In basis point calculation, input with fees => input * 997
        uint256 inputWithFees = amountIn *997;
        uint256 numerator = reserveOut * inputWithFees;
        uint256 denominator = (reserveIn*1000) + inputWithFees;

        // Equivalent to : OutputAmount = (reserveout * originalinputwithFees * 1000) / (reservein + originalinputwithFees) * 1000;

        outAmount = numerator/denominator;

    }




}