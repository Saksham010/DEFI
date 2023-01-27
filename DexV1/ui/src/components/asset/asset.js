import "./asset.css";
import {useState,useRef, useEffect} from "react";
import AraswapLogo from "../../Araswap.png";
import {useCookies} from "react-cookie";
import { ethers } from "ethers";
import ABI from "../../ERC20ABI.json";
import { Link } from "react-router-dom";
export default function Asset(props){

    const ethImgPath = "https://res.cloudinary.com/sushi-cdn/image/fetch/f_auto,fl_sanitize,q_auto,w_48/https://raw.githubusercontent.com/sushiswap/list/master/logos/native-currency-logos/ethereum.svg";
    //ticker symbol 
    const [tickerSymbol1,setTickerSymbol1] = useState("ETH");
    const [tickerSymbol2,setTickerSymbol2] = useState("ARP");

    //Ticker logo path
    const [tickerImg1, setTickerImg1] = useState(ethImgPath);
    const [tickerImg2,setTickerImg2] = useState(AraswapLogo);


    
    //Input state
    const [input1, setinput1] = useState("");
    const [width,setWidth] = useState(35);
    const [inputUSDisplay,setInputUSDisplay] = useState("none");
    const inputRef = useRef(null);
    const inputUSD = useRef(null);

    const [input2, setinput2] = useState("");
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
                
                setinput1("");
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
                    console.log("Prevlenght = ",previnput.length, " current length: ",event.target.value.length)
                    if(previnput.length <= event.target.value.length){
                        setWidth(width + 8);
                    }
                    else{
                        console.log("SHRIKINg");
                        setWidth(width - 8);
                    }
                    return event.target.value;
                })


            }
            else{
                setinput1(prev => prev);
            }
        }
        else if(event.target.id == "secondinput" || event.target.id == "two"){
            setInputUSDisplay2("inline");
   
            if(event.target.value == ''){
                
                setinput2("");
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
                    if(previnput.length <= event.target.value.length){
                        setWidth2(width2 + 8);
                    }
                    else{
                        setWidth2(width2 - 8);
                    }
                    return event.target.value;
                })
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
    const [balance1,setBalance1] = useState(0);
    const [balance2,setBalance2] = useState(0);
    const [cookies,setCookie] = useCookies(['WalletAddress']);
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    //Getting Eth balance
    provider.getBalance(cookies.WalletAddress).then((value)=>{
        let formattedBalance = ethers.utils.formatUnits(value._hex, "ether").slice(0,6);
        // console.log("Balanced fetched: ",formattedBalance);
        setBalance1(formattedBalance);
    }).catch((error)=>{
      console.log("Get Balance error: ", error);
    });

    //Getting ARP balance
    const contract = new ethers.Contract("0x9E9adC71262AB77b460e80d41Dded76dD43407e9",ABI,provider);
    contract.balanceOf(cookies.WalletAddress).then((value)=>{
        let formattedBalance = ethers.utils.formatUnits(value._hex, "ether");
        // console.log("ARP balance fetched: ",formattedBalance);
        setBalance2(formattedBalance);
    }).catch((error)=>{
        console.log("Get ARP balance error: ",error);
    });


    //Asset flipping logic for Swap
    function flipAsset(){


        //Swapping ticker symbol
        const tempTicker1 = tickerSymbol1;
        setTickerSymbol1(tickerSymbol2);
        setTickerSymbol2(tempTicker1);

        //Swapping logo
        const tempLogo1 = tickerImg1;
        setTickerImg1(tickerImg2);
        setTickerImg2(tempLogo1);

        //Swapping balance
        const tempBalance1 = balance1;
        setBalance1(balance2);
        setBalance2(tempBalance1);

    }


    return(
        <div className="assetContainer">
            <h3>{props.type}</h3>
            <div className="asset">
                <div className="ticker">
                    <div className="ethImg">
                        <img src={tickerImg1}></img>
                    </div>
                    <span>{tickerSymbol1}</span>
                </div>
                <br/>
                <div className="input-amount">
                    <div className="innerInput" id="one" onClick={handleParentDiv}>
                        <input placeholder="0" id="firstinput" value={input1} onChange={handleChange} ref={inputRef} style={{width: `${width}px`}}></input>
                        <span ref={inputUSD} style={{display:`${inputUSDisplay}` }}>~${input1*1000}</span>
                    </div>
                    <span className="balance">Balance: {balance1}</span>

                </div>
            </div>
            <div className="motionContainer" onClick={flipAsset}>
                <div className="flipIconContainer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="2" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>            

                </div>

            </div>
            {/* <br/> */}
            <div className="asset">
                <div className="ticker">
                    <div className="ethImg">
                        <img src={tickerImg2}></img>
                    </div>
                    <span>{tickerSymbol2}</span>
                </div>
                <br/>
                <div className="input-amount">
                    <div className="innerInput" id="two" onClick={handleParentDiv}>
                        <input placeholder="0" id="secondinput" value={input2} onChange={handleChange} ref={inputRef2} style={{width: `${width2}px`}}></input>
                        <span ref={inputUSD2} style={{display:`${inputUSDisplay2}` }}>~${input2*1000}</span>
                    </div>
                    <span className="balance">Balance: {balance2}</span>

                </div>
            </div>
            <div className="addBtn">

                {cookies.WalletAddress == undefined ? <Link to='/connect'><button className="addLiquidbtn"> Connect Wallet</button></Link>:<button className="addLiquidbtn">{props.type == "Swap"? "Swap":"Add Liquidity"}</button> }
            </div>

        </div>
    )
}