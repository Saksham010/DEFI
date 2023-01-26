import "./asset.css";
import {useState,useRef, useEffect} from "react";
import AraswapLogo from "../../Araswap.png";
import {useCookies} from "react-cookie";
import { ethers } from "ethers";
import ABI from "../../ERC20ABI.json";
import { Link } from "react-router-dom";
export default function Asset(props){
    const [input1, setinput1] = useState(0);
    const [width,setWidth] = useState(35);
    const [inputUSDisplay,setInputUSDisplay] = useState("none");
    const inputRef = useRef(null);
    const inputUSD = useRef(null);


    const [input2, setinput2] = useState(0);
    const [width2,setWidth2] = useState(35);
    const [inputUSDisplay2,setInputUSDisplay2] = useState("none");
    const inputRef2 = useRef(null);
    const inputUSD2 = useRef(null);


    useEffect(()=>{
        setWidth(inputRef.current.offsetWidth);
        setWidth2(inputRef2.current.offsetWidth);
    },[])

    //Handle input
    function containsOnlyNumbers(str) {
        // return /^\d+$/.test(str);
        // return /^[\d|\.]/.test(str);
        return /^\d+$/.test(str) || /\./.test(str);

    }

    function handleChange(event){
        if(event.target.id == "firstinput" || event.target.id == "one"){
            setInputUSDisplay("inline");
        
            console.log("Event: ",parseFloat(event.target.value));
            if(event.target.value == ''){
                
                setinput1(0);
                setWidth(35);
                setInputUSDisplay("none");
            }

            else if(containsOnlyNumbers(event.target.value)){
    
                //Limit length
                if(Number(event.target.value.length) >= 10){
                    //Mantine notification 
                    return;
                }
    
                setinput1(previnput =>{
                    if(previnput < Number(event.target.value)){
                        setWidth(width + 8);
                    }
                    else{
                        setWidth(width - 8);
                    }
                    return Number(event.target.value);
                })


            }
            else{
                setinput1(prev => prev);
            }
        }
        else if(event.target.id == "secondinput" || event.target.id == "two"){
            setInputUSDisplay2("inline");
            console.log("Event: ",event.target.id);
            console.log("Event value: ",event.target.value);
            
            if(event.target.value == ''){
                
                setinput2(0);
                setWidth2(35);
                setInputUSDisplay2("none");
            }
            else if(containsOnlyNumbers(event.target.value)){
    
                //Limit length
                if(Number(event.target.value.length) >= 10){
                    //Mantine notification 
                    return;
                }
    
    
                setinput2(previnput =>{
                    console.log("PREvious input: ",previnput," and curret: ",Number(event.target.value));
                    if(previnput < Number(event.target.value)){
                        setWidth2(width2 + 8);
                    }
                    else if(previnput > Number(event.target.value)){
                        console.log("Running");
                        setWidth2(width2 - 8);
                    }
                    return Number(event.target.value);
                })
                setinput2(Number(event.target.value));
            }
            else{
                setinput2(prev => prev);
            }
        }

    }

    function handleParentDiv(event){
        console.log(event.target.id);
        if(event.target.id == "one"){
            
            inputRef.current.focus();
        }
        else if(event.target.id == "two"){
            inputRef2.current.focus();
        }

    }

    //Get balance of the user from cookie
    const [ethbalance,setBalance] = useState(0);
    const [ARPBalance,setARPBalance] = useState(0);
    const [cookies,setCookie] = useCookies(['WalletAddress']);
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    //Getting Eth balance
    provider.getBalance(cookies.WalletAddress).then((value)=>{
        let formattedBalance = ethers.utils.formatUnits(value._hex, "ether").slice(0,6);
        // console.log("Balanced fetched: ",formattedBalance);
        setBalance(formattedBalance);
    }).catch((error)=>{
      console.log("Get Balance error: ", error);
    });

    //Getting ARP balance
    const contract = new ethers.Contract("0x9E9adC71262AB77b460e80d41Dded76dD43407e9",ABI,provider);
    contract.balanceOf(cookies.WalletAddress).then((value)=>{
        let formattedBalance = ethers.utils.formatUnits(value._hex, "ether");
        // console.log("ARP balance fetched: ",formattedBalance);
        setARPBalance(formattedBalance);
    }).catch((error)=>{
        console.log("Get ARP balance error: ",error);
    });


    return(
        <div className="assetContainer">
            <h3>{props.type}</h3>
            <div className="asset">
                <div className="ticker">
                    <div className="ethImg">
                        <img src="https://res.cloudinary.com/sushi-cdn/image/fetch/f_auto,fl_sanitize,q_auto,w_48/https://raw.githubusercontent.com/sushiswap/list/master/logos/native-currency-logos/ethereum.svg"></img>
                    </div>
                    <span>ETH</span>
                </div>
                <br/>
                <div className="input-amount">
                    <div className="innerInput" id="one" onClick={handleParentDiv}>
                        <input placeholder="0" id="firstinput" value={input1} onChange={handleChange} ref={inputRef} style={{width: `${width}px`}}></input>
                        <span ref={inputUSD} style={{display:`${inputUSDisplay}` }}>~${input1*1000}</span>
                    </div>
                    <span className="balance">Balance: {ethbalance}</span>

                </div>
            </div>
            <br/>
            <div className="asset">
                <div className="ticker">
                    <div className="ethImg">
                        <img src={AraswapLogo}></img>
                    </div>
                    <span>ARP</span>
                </div>
                <br/>
                <div className="input-amount">
                    <div className="innerInput" id="two" onClick={handleParentDiv}>
                        <input placeholder="0" id="secondinput" value={input2} onChange={handleChange} ref={inputRef2} style={{width: `${width2}px`}}></input>
                        <span ref={inputUSD2} style={{display:`${inputUSDisplay2}` }}>~${input2*1000}</span>
                    </div>
                    <span className="balance">Balance: {ARPBalance}</span>

                </div>
            </div>
            <div className="addBtn">

                {cookies.WalletAddress == undefined ? <Link to='/connect'><button className="addLiquidbtn"> Connect Wallet</button></Link>:<button className="addLiquidbtn">{props.type == "Swap"? "Swap":"Add Liquidity"}</button> }
            </div>


        </div>
    )
}