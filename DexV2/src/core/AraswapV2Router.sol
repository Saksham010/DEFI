// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "./AraswapV2Library.sol";

interface IAraswapV2Factory{
    function createPair(address tokenA, address tokenB)external returns(address);

}
interface IAraswapPair{
    function mint(address) external returns(uint256);
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





}