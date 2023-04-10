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


    // Get output amount for known input amount
    function getOutputAmount(uint256 reserveIn, uint256 reserveOut, uint256 amountIn) public returns(uint256 outAmount) {

        // Assuming 0.3% fee, r = 1-fees = 1-3% ==> 0.997
        //  input amount with fees => input amount * r => inputamount * 0.97

        // In basis point calculation, input with fees => input * 997
        uint256 inputWithFees = amountIn *997;
        uint256 numerator = reserveOut * inputWithFees;
        uint256 denominator = (reserveIn*1000) + inputWithFees;

        // Equivalent to : OutputAmount = (reserveout * originalinputwithFees * 1000) / (reservein + originalinputwithFees) * 1000;

        outAmount = numerator/denominator;

    }

    // Get outputAmountList
    function getOutList(address factory, uint256 amountIn, address[] memory path) public returns(uint256[] memory){

        // Check if the path is less than two then now valid swap, ie [tokenA,] =  tokenA -> ??? 
        if(path.length < 2){
            revert("Invalid swap, path lenght not sufficient");
        }

        // Array to save output list
        uint256[] memory ouputList = new uint256[](path.length);

        // Saving first input amount in output list
        outputList[0] = amountIn;

        for(uin256 i =0; i < path.length-1; i++){
            (uint112 r0, uint112 r1) = getReserves(factory,path[i],path[i+1]);
            ouputList[i+1] = getOutputAmount(uint256(r0),uint256(r1),ouputList[i]);
        }

        return outputList;
    }

    // Get input amount for known output amount (Inverted swapping)
    // Same fee dynamics as getOutputAmount
    function getInputAmount(uint256 reserveIn, uint256 reserveOut,uint256 outputAmount) public pure returns(uint256 inputAmount){
        //Basis point calculation
        //r = 997
        uint256 numerator = reserveIn * outputAmount * 1000;
        uint256 denominator = (reserveOut - outputAmount) * 997;

        //Since the input calculted should result in output, the integer division will round down so adding 1 will result in input
        //that will give greator or equal output amount
        inputAmount = (numerator/denominator) + 1;
    }
    
    // Get inputAmountList
    function getInList(address factory, uint256 amountOut, address[] memory path) public returns(uint256[] memory){
             // Check if the path is less than two then now valid swap, ie [tokenA,] =  tokenA -> ??? 
        if(path.length < 2){
            revert("Invalid swap, path lenght not sufficient");
        }

        // Array to save input length
        uint256[] memory inputList = new uint256[](path.length);

        //Saving last index value as output to the input list
        inputList[inputList.length-1] = amountOut;

        // Starting from last index
        for(uint256 i = pair.length-1; i> 0;i--){
            (uint112 r0, uint112 r1) = getReserves(factory,path[i-1],path[i]);
            inputList[i-1] =getInputAmount(r0,r1,inputList[i])
        }
        return inputList;
    }


}


