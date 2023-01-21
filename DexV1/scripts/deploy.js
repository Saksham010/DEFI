const { ethers } = require("hardhat");
require("dotenv").config({ path: ".env" });
const { ARPTOKEN_CONTRACT_ADDRESS } = require("../constants/constant");

async function main(){
  const ARPTokenAddress = ARPTOKEN_CONTRACT_ADDRESS;

  const ExchangeFactory = await ethers.getContractFactory("Araswap");
  const ExchangeContract = await ExchangeFactory.deploy(ARPTokenAddress);
  await ExchangeContract.deployed();

  console.log("Exchange contract Address: ", ExchangeContract.address);
}

main().then(()=>process.exit(0))
      .catch((error)=>{
        console.error(error);
        process.exit(1);
      });