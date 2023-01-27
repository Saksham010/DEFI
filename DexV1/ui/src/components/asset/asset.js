import "./asset.css";
import {useState,useRef, useEffect} from "react";
import AraswapLogo from "../../Araswap.png";
import {useCookies} from "react-cookie";
import { ethers } from "ethers";
import ABI from "../../ERC20ABI.json";
import { Link } from "react-router-dom";
import ARASWAPABI from "../../Araswap.json";

export default function Asset(props){

    const ethImgPath = "https://res.cloudinary.com/sushi-cdn/image/fetch/f_auto,fl_sanitize,q_auto,w_48/https://raw.githubusercontent.com/sushiswap/list/master/logos/native-currency-logos/ethereum.svg";
    //ticker symbol 
    const [tickerSymbol1,setTickerSymbol1] = useState("ETH");
    const [tickerSymbol2,setTickerSymbol2] = useState("ARP");

    //Ticker logo path
    const [tickerImg1, setTickerImg1] = useState(ethImgPath);
    const [tickerImg2,setTickerImg2] = useState(AraswapLogo);

    //Provider

    //ARPRateperETH
    const [ARPrate,setARPRate] = useState(0);
    //ETHRateperDollar
    const[ETHPrice,setETHPrice] = useState(1500);
    const [noARPperETH, setNoARPperETH] = useState(0);
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    //Set ARP rate
    getARPprice().then((amount)=>{
        const formatted = ethers.utils.formatUnits(amount._hex,"wei");
        console.log("Fetched ARPproce", formatted);
        setNoARPperETH(formatted);
        const EthByARP = 1/formatted;
        setARPRate(EthByARP);
    });

    //Get ETH price
    // fetch('https://rest.coinapi.io/v1/exchangerate/ETH/USD',{
    //     headers:{
    //         'X-CoinAPI-Key': '487715E4-9266-48C8-8AB5-7C56BE8167C2'
    //     }
    // })
    // .then((response) => response.json())
    // .then((data) => {
    //     setETHPrice(data.rate);
    // });

    
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


        //Two way connection
        if(props.type == "Swap"){
            if(event.target.id == "firstinput" || event.target.id == "one"){

                if(event.target.value == ""){
                    setinput2("");
                    setInputUSDisplay2("none");
                    return;
                }
                
                //If the first box is ether
                if(tickerSymbol1 == "ETH"){
                    //ETH to ARP
                    const floatETH = parseFloat(event.target.value);
                    const arpvalue = noARPperETH * floatETH;
                    setinput2((arpvalue).toString().slice(0,9));
                    setInputUSDisplay2("inline");
                    updateWidth((arpvalue).toString().slice(0,9), 2);
                }
                else if(tickerSymbol1 =="ARP"){
                    const floatARP = parseFloat(event.target.value);
                    const ethvalue = floatARP * ARPrate;
                    setinput2(ethvalue.toString().slice(0,9));
                    setInputUSDisplay2("inline");
                    updateWidth(ethvalue.toString().slice(0,9),2);
                }

            }
            else if(event.target.id == "secondinput" || event.target.id == "two"){

                if(event.target.value == ""){
                    setinput1("");
                    setInputUSDisplay("none");
                    return;
                }

                //If the second box is ether
                if(tickerSymbol2 == "ETH"){                    
                    const floatETH = parseFloat(event.target.value);
                    const arpvalue = noARPperETH * floatETH;
                    setinput1((arpvalue).toString().slice(0,9));
                    setInputUSDisplay("inline");
                    updateWidth((arpvalue).toString().slice(0,12), 1);

                }
                else if(tickerSymbol2 == "ARP"){
                    const floatARP = parseFloat(event.target.value);
                    const ethvalue = floatARP * ARPrate;
                    setinput1(ethvalue.toString().slice(0,9));
                    setInputUSDisplay("inline");
                    updateWidth(ethvalue.toString().slice(0,9),1);

                }

            }
        }

    }

    function updateWidth(target, box){
        if(box == 1){
            setWidth(35 + target.length * 8);
        }
        else{
            setWidth2(35 + target.length * 8);
        }
    }
    console.log("Widht2: ",width2);

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

    //Getting Eth balance
    provider.getBalance(cookies.WalletAddress).then((value)=>{
        let formattedBalance = ethers.utils.formatUnits(value._hex, "ether").slice(0,9);
        // console.log("Balanced fetched: ",formattedBalance);

        //To map the flip
        if(tickerSymbol1 == "ETH"){

            setBalance1(formattedBalance);
        }
        else{
            setBalance2(formattedBalance);
        }
    }).catch((error)=>{
      console.log("Get Balance error: ", error);
    });

    //Getting ARP balance
    const contract = new ethers.Contract("0x9E9adC71262AB77b460e80d41Dded76dD43407e9",ABI,provider);
    contract.balanceOf(cookies.WalletAddress).then((value)=>{
        let formattedBalance = ethers.utils.formatUnits(value._hex, "ether").slice(0,9);
        // console.log("ARP balance fetched: ",formattedBalance);
        
        //To map the flip
        if(tickerSymbol2 == "ARP"){
            
            setBalance2(formattedBalance);
        }
        else{
            setBalance1(formattedBalance);
        }

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

        //Swapping inputs
        const tempInput1 = input1;
        setinput1(input2);
        setinput2(tempInput1);

        //Swapping width
        const tempwidth1 = width;
        setWidth(width2);
        setWidth2(tempwidth1);

    }


    //Smart contract interaction

    //Add liquidity
    async function AddLiquidity(){
        console.log("Add liquidity running");
        const signer  = provider.getSigner();
        //Contract instance
        const ArpTokenContract = new ethers.Contract("0x9E9adC71262AB77b460e80d41Dded76dD43407e9",ABI,signer);
        const AraswapExchangeContract = new ethers.Contract("0x7726e388C25Bd96c98577dD8bBa02459CB37979e", ARASWAPABI,signer);

        //Adding liquidity

        try{

            //Parsing ARPtoken
            const ArpTokenAmount = tickerSymbol1 == "ETH"?input2:input1;
            const floatARPToken = parseFloat(ArpTokenAmount);
            const lastValue = ArpTokenAmount[ArpTokenAmount.length-1];
            const parsedARP = lastValue < 5?Math.floor(floatARPToken):Math.ceil(floatARPToken);
    
            //Parsing Ether to BigNumber 
            const etherAmount = tickerSymbol1 =="ETH"?input1:input2;
            const parsedEther = ethers.utils.parseEther(etherAmount);
    
    
            //Calling function

            const approveTransaction = await ArpTokenContract.approve("0x7726e388C25Bd96c98577dD8bBa02459CB37979e", parsedARP);
            await approveTransaction.wait();
            console.log(approveTransaction);

            const LPTokens = await AraswapExchangeContract.addLiquidity(parsedARP, {value: parsedEther});
                
            return LPTokens;

        }
        catch(error){
            console.error(error);
        }

    }

    async function getARPprice(){
        const AraswapExchangeContract = new ethers.Contract("0x7726e388C25Bd96c98577dD8bBa02459CB37979e", ARASWAPABI,provider);
        
        //Getting ARP reserve of the contract
        const ContractARPreserve = await AraswapExchangeContract.getReserve();
        const formattedARPReserve = ethers.utils.formatUnits(ContractARPreserve._hex,"wei");
        // ContractARPreserve.wait();

        //Getting ETH reserve of the contract
        const ContractEthReserve =  await provider.getBalance("0x7726e388C25Bd96c98577dD8bBa02459CB37979e");
        const formattedETHReserve = ethers.utils.formatUnits(ContractEthReserve._hex, "wei");
        
        // ContractEthReserve.wait();

        // //Calculating ouput ARP amount
        const ARPamount = await AraswapExchangeContract.getOutputTokenAmount(ethers.utils.parseEther("1"), formattedETHReserve,formattedARPReserve);
        // ARPamount.wait();

        console.log("ARP amount to be received",ethers.utils.formatUnits(ARPamount._hex,"wei"));
        return ARPamount;
    }


    //Swap Tokens
    async function SwapTokens(){
        const signer  = provider.getSigner();
        //Contract instance
        const ArpTokenContract = new ethers.Contract("0x9E9adC71262AB77b460e80d41Dded76dD43407e9",ABI,signer);
        const AraswapExchangeContract = new ethers.Contract("0x7726e388C25Bd96c98577dD8bBa02459CB37979e", ARASWAPABI,signer);

        //Get the output amount
        getARPprice((amountPerEth)=>{
            console.log("Fetched amount per 1 ETH: ",amountPerEth);
            setARPRate(amountPerEth);

        })

        // try{

        // }catch(error){
        //     console.error(error);
        // }




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
                        <span ref={inputUSD} style={{display:`${inputUSDisplay}` }}>~${tickerSymbol1 == "ETH"?(input1*ETHPrice).toString().slice(0,10): (input1 *ARPrate* ETHPrice).toString().slice(0,11) }</span>
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
                        <span ref={inputUSD2} style={{display:`${inputUSDisplay2}` }}>~${tickerSymbol2 == "ETH"?(input2*ETHPrice).toString().slice(0,10): (input2 *ARPrate* ETHPrice).toString().slice(0,11)}</span>
                    </div>
                    <span className="balance">Balance: {balance2}</span>

                </div>
            </div>
            <div className="addBtn">

                {cookies.WalletAddress == undefined ? <Link to='/connect'><button className="addLiquidbtn"> Connect Wallet</button></Link>:<button className="addLiquidbtn" onClick={props.type == "Swap"?SwapTokens:AddLiquidity}>{props.type == "Swap"? "Swap":"Add Liquidity"}</button> }
            </div>

        </div>

    )
}