import "./connect.css";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import {useCookies} from "react-cookie";
import { showNotification,updateNotification } from '@mantine/notifications';
import { IconCheck,IconX } from '@tabler/icons';
import { useNavigate } from "react-router-dom";


export default function Connect(){
    //Navigation hook
    const navigate = useNavigate();
    //Cookie
    const [cookies,setCookie,removeCookie] = useCookies(['WalletAddress']);

    //Provider
    const provider = new ethers.providers.Web3Provider(window.ethereum);


    async function connectWithMetamask (){

        //Show notification
        showNotification({
            id:'connect',
            title:"Connecting",
            message:"Waiting for you to connect",
            loading:true,
            disallowClose:true,
            color:'green',
            style: { 
                backgroundColor: "#202231",
            },
            styles: (theme)=>({
                root: {
                    borderColor:"#202231",
    
                },
                title:{color:theme.white},
            }),
            autoClose:false,
        })

        const accounts = await provider.send("eth_requestAccounts",[]);
        const networks = await provider.getNetwork();
        console.log(accounts);
        console.log(networks);

        if(networks.name != 'goerli'){
            updateNotification({
                id:'connect',
                title:"Oopsie Wrong Network",
                message:"Switch to Goerli testnet and try again",
                disallowClose:true,
                color:'red',
                style: { 
                    backgroundColor: "#202231",
                },
                styles: (theme)=>({
                    root: {
                        borderColor:"#202231",
        
                    },
                    title:{color:theme.white},
                }),
            })
            return;
        }
        else{
            updateNotification({
                id:'connect',
                title:"Connected successfully",
                message:`Welcome: ${accounts[0]}`,
                disallowClose:true,
                color:'teal',
                style: { 
                    backgroundColor: "#202231",
                },
                styles: (theme)=>({
                    root: {
                        borderColor:"#202231",
        
                    },
                    title:{color:theme.white},
                }),
            })
            setCookie('WalletAddress',accounts[0],{path:'/'});

            setTimeout(()=>{

                updateNotification({
                    id:'connect',
                    title:"Redirecting",
                    message:"Taking you to homepage",
                    disallowClose:true,
                    loading:true,
                    color:'teal',
                    style: { 
                        backgroundColor: "#202231",
                    },
                    styles: (theme)=>({
                        root: {
                            borderColor:"#202231",
            
                        },
                        title:{color:theme.white},
                    }),
                    autoClose:4000,

                })
            },2000)
            
            setTimeout(()=>{
                navigate("/");

            },3500);

            setTimeout(()=>{
                updateNotification({
                    id:'connect',
                    loading:false,
                    disallowClose:true,
                    title:"Reached homepage",
                    message:"Welcome to the land of swaps",
                    color:'teal',
                    style: { 
                        backgroundColor: "#202231",
                    },
                    styles: (theme)=>({
                        root: {
                            borderColor:"#202231",
            
                        },
                        title:{color:theme.white},
                    }),
                    autoClose:2500

                })
                
            },5000);


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
        //Notification
        showNotification({
            title:"Disconnected",
            message:"Wallet has been disconnected successfully",
            disallowClose:true,
            color:'red',
            style: { 
                backgroundColor: "#202231",
            },
            styles: (theme)=>({
                root: {
                    borderColor:"#202231",
    
                },
                title:{color:theme.white},
            }),
        })
        removeCookie("WalletAddress");

    }

    
    return(
        <div className="connect-Container">

            {cookies.WalletAddress == undefined? <button onClick={connectWithMetamask}>Connect With Metamask</button>: <button onClick={disconnectWallet}>{cookies.WalletAddress.slice(0,12)}...</button>}
            
            
        </div>
    )
}