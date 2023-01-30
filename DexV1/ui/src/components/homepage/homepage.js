import Asset from "../asset/asset";
import { ethers } from "ethers";


import {useState} from "react";
import "./home.css";
export default function Homepage(props){
    
    if (typeof window.ethereum !== 'undefined') {
        console.log('MetaMask is installed!');
    }

    return(
        <div className="homecontainer">
            <Asset type="Swap"  />

        </div>
    )
}