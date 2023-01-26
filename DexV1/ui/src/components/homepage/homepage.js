import Asset from "../asset/asset";
import { ethers } from "ethers";
export default function Homepage(props){
    
    if (typeof window.ethereum !== 'undefined') {
        console.log('MetaMask is installed!');
    }

    

    return(
        <div>
            <Asset type="Swap" />

        </div>
    )
}