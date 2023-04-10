pragma solidity ^0.8.13;


interface IAraswapPair{
    function swap(uint256, uint256 , address , bytes calldata)external;
}


contract Flashloaner {
    error InsufficientFlashLoanAmount();

    uint256 expectedLoanAmount;

    // Borrow flash loan
    function flashloan(address pairAddress, uint256 amount0Out,uint256 amount1Out, address tokenAddress)public{

        if(amount0Out > 0){
            expectedLoanAmount = amount0Out;
        }
        if(amount1Out > 0){
            expectedLoanAmount = amount1Out;
        }

        // Requesting loan
        IAraswapPair(pairAddress).swap(amount0Out,amount1Out,address(this),abi.encode(tokenAddress));

    }

    function LoanRepay(address sender,uint256 amount0Out, uint256 amount1Out,bytes calldata data) public{
        address tokenAddress = abi.decode(data,(address));
        uint256 _loantokenBalance = ERC20(tokenAddress).balanceOf(address(this));

        // Check if the required loan has been received or not
        if(_loantokenBalance < expectedLoanAmount){
            revert("Insufficient loan");
        }

        // Do something with the flash loan

        // Repay the flash loan
        ERC20(tokenAddress).transfer(msg.sender,_loantokenBalance);

    }   

}