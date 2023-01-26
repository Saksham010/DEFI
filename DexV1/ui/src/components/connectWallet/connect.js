import "./connect.css";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import {useCookies} from "react-cookie";

export default function Connect(){

    //Cookie
    const [cookies,setCookie,removeCookie] = useCookies(['WalletAddress']);

    //Provider
    const provider = new ethers.providers.Web3Provider(window.ethereum);


    async function connectWithMetamask (){

        const accounts = await provider.send("eth_requestAccounts",[]);
        const networks = await provider.getNetwork();
        console.log(accounts);
        console.log(networks);

        if(networks.name != 'goerli'){
            alert("Wrong chain switch to goerli testnet");

            return;
        }
        else{
            setCookie('WalletAddress',accounts[0],{path:'/'});
        }
    
    }

    window.ethereum.on('accountsChanged',function(accounts){
        console.log(accounts, "Account changed");
        console.log("Current User Detail: ",cookies.WalletAddress);
        if(cookies.WalletAddress != null && cookies.WalletAddress != accounts[0]){
            alert("Account changed switch back");
        }
    });

    //Disconnect wallet
    function disconnectWallet(){
        removeCookie("WalletAddress");

    }

    
    return(
        <div className="connect-Container">

            {cookies.WalletAddress == undefined? <button onClick={connectWithMetamask}>Connect With Metamask</button>: <button onClick={disconnectWallet}>{cookies.WalletAddress.slice(0,12)}...</button>}
            
            
        </div>
    )
}