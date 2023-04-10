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


    // Token to token (exact -> unknown)
    function swapExactTokensForTokens(uint256 inamount, uint256 outAmountMin, address[] calldata path, address to) public returns(uint256[] memory amounts){

        // Amounts array of each swap in a chain
        amounts = AraswapV2Library.getOutList(address(factory), inamount,path);

        // Check if the final ouput of the chained swap is greater or equals to minmum ouptut amount
        if(amounts[amounts.length-1] < outAmountMin){
            revert("Insufficient ouput");
        }

        // If the amount satisfies the minimum requirement -> Transfer it to the pair contract
        _safeTransferFrom(path[0],
                        msg.sender,
                        AraswapV2Library.pairFor(address(factory),path[0],path[1]),
                        amounts[0]);

        // Swapping tokens
        _swap(amounts,path,to);

    }

    // Token to token (unknown -> Exact)
    function swapTokensForExactTokens(uint256 outamount,uint256 inAmountMax,address[] calldata path, address to) public returns(uint256[] memory amounts){
        //Input amounts
        amounts = AraswapV2Library.getInList(address(factory),outamount,path);

        if (amounts[0] > amountInMax){
            revert("Excess input amount");
        }

        // Transfer token from sender to pair contract
        _safeTransferFrom(path[0],
                        msg.sender,
                        AraswapV2Library.pairFor(address(factory),path[0],path[1],
                        amounts[0]);

        // Swap tokens
        _swap(amounts,path,to);
    }

    // Swap function
    function _swap(uint256[] memory amounts,uint256[] memory path,address to) internal{
        
        for(uint256 i; i < path.length-1;i++){
            (address tokenin,address tokenout)=(path[i],path[i+1]);

            // Sorting these tokens
            (address token0, address token1) = AraswapV2Library.sortTokens(tokenin,tokenout);
        
            // Calculate ouput amount for the swap (since first index stores input amount)
            uint256 amountOut = amounts[i+1];

            //Since there is no direction of swap we send in the amounts we dont want to get by 0 and amount we want by given ouputamount 
            (uint256 out0, uint256 out1) = token0 == tokenin?(uint256(0),amountOut): (amountOut,uint256(0));

            // If this is intermediate swap the dest address should be the next pair because the next pair is gonna perform the swap.
            //If this is the final swap the dest should be the caller
            address _to = i == (path.length - 2) ? to: AraswapV2Library.pairFor(address(factory),tokenout,path[i+2]);
            
            // Swap tokens
            IAraswapPair(AraswapV2Library.pairFor(address(factory),tokenin,tokenout)).swap(out0,out1,_to);
        }

    }


    // Safe transfer
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
}