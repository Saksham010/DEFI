//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Araswap is ERC20{

    address public ARPTokenAddress;

    constructor(address _arpTokenAddress) ERC20("Araswap LP Token","ARPLP"){

        require(_arpTokenAddress != address(0),"Token address should not be null");
        ARPTokenAddress = _arpTokenAddress;

    }

    //Returns the number of ARPToken held by the smart contract
    function getReserve() view public returns(uint){
        return ERC20(ARPTokenAddress).balanceOf(address(this));
    }

    //Add liquidity in form of ETH
    function addLiquidity(uint _amount) public payable returns(uint){
        uint LPTokens;
        uint ethBalance = address(this).balance;
        uint ARPTokenRerserve = getReserve();
        ERC20 ARPToken = ERC20(ARPTokenAddress);

        //If the liquidity is added for the first time
        if(ARPTokenRerserve == 0){
            //Transferring token to this contract
            ARPToken.transferFrom(msg.sender, address(this),_amount * 10**18);
            //Since this is the first liquidity added to the pool say 100Eth: 100 ARP then total liquidity is 100 ETH
            LPTokens = ethBalance; //Payable value is updated first
            //Minting Liquidity pool token and sending to the depositor
            _mint(msg.sender, LPTokens);
        }
        //IF not the first time
        else{
            //Not counting the eth during this call
            uint ethReserve = ethBalance - msg.value;

            //Calculating the minmum ARP Token that user can stake
            uint minimumARPTokenAmount = (msg.value * ARPTokenRerserve)/ ethReserve;
            require(_amount >= minimumARPTokenAmount, "Amount of token send is less than the minimum amount");

            //Transferring ARP Token from sender to the contract
            ARPToken.transferFrom(msg.sender, address(this), _amount* 10**18);
            //LP token ratio 
            LPTokens = (msg.value * totalSupply()) / ethReserve; //totalSupply => Total number of lp tokens minted
            //Minting and sending LP tokens to the msg.sender
            _mint(msg.sender, LPTokens);

        }
        return LPTokens;
    }

    //Remove liquiidty  (_amount => LP token amount)
    function removeLiquidity(uint _amount) public returns(uint,uint) {
        
        require(_amount > 0,"Amount to withdraw cannot be 0 or less");
        require(_amount <= balanceOf(msg.sender),"User doesnot have enough LP tokens "); //Check if the user has enough amount of LP tokens

        uint ethReserve = address(this).balance;
        uint ARPReserve = getReserve();
        ERC20 ARPToken = ERC20(ARPTokenAddress);

        //Amount of eth that the user will get
        uint ethAmount = (_amount * ethReserve )/ totalSupply();
        //Amount of tokens that the user will get
        uint ARPTokenAmount = (_amount * ARPReserve) / totalSupply();

        //Burning LP tokens
        _burn(msg.sender,_amount);

        //Sending ether back to user
        payable(msg.sender).transfer(ethAmount);
        //Sending ARP tokens back to the user
        ARPToken.transfer(msg.sender,_amount * 10**18);

        return (ethAmount,ARPTokenAmount);
    }

    //Get outputAmount
    function getOutputTokenAmount(uint inputAmount, uint inputReserve, uint outputReserve) public pure returns(uint){
        require(inputReserve != 0 && outputReserve != 0, "The reserves are invalid" );

        //Adding 1% fee in input amonut
        uint inputAmountWithFees = inputAmount * 99;

        uint numerator =  inputAmountWithFees * outputReserve;
        uint denominator = inputReserve * 100 + inputAmountWithFees; //Adjusting in input reserve 

        return numerator / denominator;
    }

    //Swap from Eth to ARP Token
    function swapFromEth(uint _minAmount) public payable{

        //Eth reserve and ARP token reserve in the contract
        uint inputReserve = address(this).balance - msg.value;
        uint outputReserve = getReserve();

        //Amount of token user should receive
        uint outputTokenAmount = getOutputTokenAmount(msg.value, inputReserve, outputReserve);

        //Cheking if outputAmount is >= min amount
        require(outputTokenAmount >= _minAmount,"Insufficient output amount");
        //Transferring the token to user
        ERC20(ARPTokenAddress).transfer(msg.sender,outputTokenAmount);

    }

    //Swap from ARP Token to ETH
    function swapToEth(uint _ARPsoldAmount, uint _minETH) public{

        uint outputReserve = address(this).balance;
        uint inputReserve = getReserve();
        ERC20 ARPToken = ERC20(ARPTokenAddress);

        uint ethToGet= getOutputTokenAmount(_ARPsoldAmount, inputReserve, outputReserve);

        require(ethToGet >= _minETH,"Insufficient output amount");

        //Transfer ARP token to the pool
        ARPToken.transfer(address(this), _ARPsoldAmount);

        //Transfer bought eth to the user
        payable(msg.sender).transfer(ethToGet);
    }

}

