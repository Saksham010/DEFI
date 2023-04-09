import {AraswapV2Pair} from "./AraswapV2Pair.sol";

interface IAraswapPair{
    function getReserves() external returns(uint112,uint112);

}

library AraswapV2Library {

    function getReserves(address factoryAddress, address tokenA, address tokenB)public (uint112 reserveA, uint112 reserveB){
        //Sorting tokens
        (address token0, address token1) = sortTokens(tokenA,tokenB);
        // Get pair for the address
        address pairAddress = pairFor(factoryAddress, token0,token1);
        (uint112 reserve0, uint112 reserve1) = IAraswapPair(pairAddress).getReserves();

        // Sort reserve
        (reserveA,reserveB) = token0 == token1?(reserve0,reserve1):(reserve1,reserve0);
    
    }
    // sort token
    function sortTokens(address tokenA, address tokenB)internal pure returns(address token0,address token1){
        return tokenA < tokenB ? (tokenA,tokenB): (tokenB,tokenA);
    }

    // Find pair address
    function pairFor(address factoryAddress, address tokenA, address tokenB) internal pure returns (address pairAddress){
        // Sort tokens
        (address token0, address token1) = sortTokens(tokenA,tokenB);

        // Find address same way that create2 opcode does
        pairAddress = address(uint160(uint256(keccak256(abi.encodePacked(hex"ff",factoryAddress,keccak256(abi.encodePacked(token0,token1)), keccak256(type(AraswapV2Pair).creationCode))))));

    }

    // Calculate optimal amount
    function quote(uint256 amountIn, uint256 reserveIn, uint256 reserveOut)public pure returns(uint256 optimalAmount){

        if(amountIn == 0){
            revert("Insufficient amount in");
        }
        if(reserveIn == 0 || reserveOut == 0){
            revert("Insufficient reserve");
        } 

        optimalAmount = (amountIn*reserveOut) / reserveIn;
    }
}


