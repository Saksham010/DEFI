// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "./AraswapV2Pair.sol";

interface IAraswapPair{
    function initialize(address, address )external;

}

contract AraswapV2Factory{

    event PairCreated(address indexed _token0, address indexed _token1,address pairAdr, uint256 pairListLength);

    // Mapping of pairs 
    mapping(address=>mapping(address => address)) public pairs;

    // List of pairs
    address[] public pairList;

    function createPair(address tokenA, address tokenB)public returns(address pair) {

        // Check if the address are null
        if(tokenA == address(0) || tokenB == address(0)){
            revert("Null address detected");
        }
        
        // Check if the token are same
        if(tokenA == tokenB){
            revert("TokenA and TokenB is same");
        }

        // Arranging in order
        (address token0, address token1) = tokenA < tokenB ?(tokenA,tokenB):(tokenB,tokenA);

        // Check if pair is already created or not
        if(pairs[token0][token1] != address(0)){
            revert("Token pair already exists");
        }

        // Create pair
        bytes memory bytecode = type(AraswapV2Pair).creationCode;
        bytes32 salt = keccak256(abi.encodePacked(token0,token1));
        
        assembly {
            pair := create2(0,add(bytecode,32), mload(bytecode),salt);
        }

        // Initialize pair contract token address 
        IAraswapPair(pair).initialize(token0,token1);

        // Updating mapping and array
        pairs[token0][token1] = pair;
        pairs[token1][token0] = pair;
        pairList.push(pair);

        //Emitting event
        emit PairCreated(token0,token1,pair,pairList.length);

        return pair;
    }

    
}