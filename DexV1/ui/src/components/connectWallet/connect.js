import "./connect.css";
import { ethers } from "ethers";
import { useEffect, useState } from "react";


export default function Connect(){

    //Provider
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const [userDetail, setuserDetail] = useState({
        currentAccount: null,
        connectedAccount: null,
        chain: null,
    })

    const [text,setText] = useState("Connect With Metamask");



    async function connectWithMetamask (){

        if(userDetail.connectedAccount == null){
            console.log("This time: ", userDetail.connectedAccount );
            const accounts = await provider.send("eth_requestAccounts",[]);
            const networks = await provider.getNetwork();
            console.log(accounts);
            console.log(networks);
    
            if(networks.name != 'goerli'){
                alert("Wrong chain switch to goerli testnet");
    
                return;
            }
            else{
    
                setuserDetail(prev =>{
                    return{
                        ...prev,
                        currentAccount: accounts[0],
                        connectedAccount: accounts[0],
                        chain: networks.name
                    }
                });
                const partialAddress = accounts[0].slice(0,14);
                setText(`${partialAddress}...`);
    
            }
        }
        else{
            //Add Mantine modal
            console.log("Resetiing");

            //Disconnect
            setuserDetail(prev=>{
                return{
                    ...prev,
                    currentAccount: null,
                    connectedAccount: null,
                    chain:null,
                }
            });
            setText("Connect With Metamask");


        }


    }

    window.ethereum.on('accountsChanged',function(accounts){
        console.log(accounts, "Account changed");
        console.log("Current User Detail: ",userDetail);
        if(userDetail.connectedAccount != null && userDetail.connectedAccount != accounts[0]){
            alert("Account changed switch back");
        }
    });


    useEffect(()=>{
        console.log("User Detail: ",userDetail);
    },[userDetail]);

    
    return(
        <div className="connect-Container">

            
            <button onClick={connectWithMetamask}> {text}</button>    
            
        </div>
    )
}