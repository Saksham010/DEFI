const { expect } = require("chai");
const { ethers } = require("hardhat");
const hre = require("hardhat");

describe("Exchange Test", function () {
    it("Should work like a DEX", async function () {
        //Getting one address
        const [, addr1] = await ethers.getSigners();

        const TokenFactory =  await ethers.getContractFactory("ARAToken");
        const ExchangeFactory = await ethers.getContractFactory("Araswap");

        //Deploying ARP token
        const tokenContract = await TokenFactory.connect(addr1).deploy(1000000);
        await tokenContract.deployed();
        console.log("ARP token address: ",tokenContract.address);

        //Deploying Exchange contract
        const ExchangeContract = await ExchangeFactory.connect(addr1).deploy(tokenContract.address);
        await ExchangeContract.deployed();
        console.log("Araswap address: ",ExchangeContract.address);

        //Addding liqudity
        console.log("Adding liquidity");
        const approveTransaction = await tokenContract.connect(addr1).approve(ExchangeContract.address,10000);
        await approveTransaction.wait();
        console.log("Transaction approved");

        const transaction = await ExchangeContract.connect(addr1).addLiquidity(10000,{value: ethers.utils.parseEther("0.2")});
        await transaction.wait();
        console.log("Liquidity added: ",transaction);

        //Balance
        console.log("User ARP balance: ",await tokenContract.balanceOf(addr1.address));
        let ethbalance = await addr1.getBalance();
        console.log("User ETH balance: ", ethers.utils.formatEther(ethbalance));

        //Swap from eth to token
        console.log("Swapping");
        const tx2 = await ExchangeContract.connect(addr1).swapFromEth(3000,{value: ethers.utils.parseEther("0.1")});
        await tx2.wait();
        console.log("Swapped succesfully");

        //Balance
        console.log("User ARP balance: after swap : ",await tokenContract.balanceOf(addr1.address));
        const eth2balance = await addr1.getBalance();
        console.log("User ETH balance:after swap:  ", ethers.utils.formatEther(eth2balance));





    });
  });