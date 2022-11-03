// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@aave/core-v3/contracts/flashloan/base/FlashLoanSimpleReceiverBase.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";


contract FlashLoan is FlashLoanSimpleReceiverBase{

    using SafeMath for uint;
    event Log(address asset, uint val);

    constructor(IPoolAddressesProvider provider)
        FlashLoanSimpleReceiverBase(provider){
    }


    function createFlashLoan(address asset, uint amount) external{

        //Receiver of flashloan
        address receiver = address(this);

        bytes memory params =""; //Parameter to be passed into executeOperation function
        uint16 referralCode = 0;

        //Calling flash loan function
        POOL.flashLoanSimple(receiver, asset,amount, params, referralCode);

    }

    function executeOperation(address asset, uint256 amount, uint256 premium, address initiator, bytes calldata params) external returns(bool){

        //Intermediate arbitrage operation in dex

        uint256 totalLoan = amount.add(premium);

        //Giving flashloan pool accesss to withdraw totalLoan from smartcontract
        IERC20(asset).approve(address(POOL), totalLoan);
        emit Log(asset, totalLoan);
        return true;
    }
    
}