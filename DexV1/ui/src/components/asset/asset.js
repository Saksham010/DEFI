import "./asset.css";
import {useState,useRef, useEffect} from "react";
import AraswapLogo from "../../Araswap.png";
import {useCookies} from "react-cookie";
import { BigNumber, ethers } from "ethers";
import ABI from "../../ERC20ABI.json";
import { Link } from "react-router-dom";
import ARASWAPABI from "../../Araswap.json";
import { Notification } from '@mantine/core';
import { showNotification,updateNotification } from '@mantine/notifications';
import { IconCheck,IconX } from '@tabler/icons';


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
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    // const provider = new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/eth_goerli	");


    // //Set ARP rate
    // getARPprice().then((amount)=>{
    //     const formatted = ethers.utils.formatUnits(amount._hex,"wei");
    //     console.log("Fetched ARPproce", formatted);
    //     setNoARPperETH(formatted);
    //     const EthByARP = 1/formatted;
    //     setARPRate(EthByARP);
    // });

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

    // const[balance1]
    const [converter1,setConverter1] = useState(0);
    const [converter2,setConverter2] = useState(0);


    function updateConverter1(){
        if(tickerSymbol1 == "ETH"){
            if(input1 != ""){

                setConverter1(parseFloat(input1.slice(0,9))*1500);
            }
            else{
                setConverter1(0);
            }


        }
        else if(tickerSymbol1 =="ARP"){
            if(input1!= ""){

                const _floatARP =  parseFloat(input1.slice(0,9));
                const last = input1[input1.length-1];
                const _parsedARP = last < 5? Math.floor(_floatARP): Math.ceil(_floatARP);
    
                getEthPrice(_parsedARP).then((outputETH)=>{
    
                    const _parsedEth = ethers.utils.formatUnits(outputETH._hex,"ether");
                    const dollarValue = _parsedEth * 1500;
                    setConverter1(dollarValue);
                })
            }
            else{
                setConverter1(0);
            }
            

        }
    }
    function updateConverter2(){
        if(tickerSymbol2 == "ETH"){
            if(input2 != ""){

                setConverter2(parseFloat(input2.slice(0,9))*1500);
            }
            else{
                setConverter2(0);
            }

        }
        else if(tickerSymbol2 == "ARP"){
            if(input2 != ""){

                const _floatARP =  parseFloat(input2.slice(0,9));
                const last = input2[input2.length-1];
                const _parsedARP = last < 5? Math.floor(_floatARP): Math.ceil(_floatARP);
    
                getEthPrice(_parsedARP).then((outputETH)=>{
    
                    const _parsedEth = ethers.utils.formatUnits(outputETH._hex,"ether");
                    const dollarValue = _parsedEth * 1500;
                    setConverter2(dollarValue);
                })
            }
            else{
                setConverter2(0);
            }
            

        }

    }


    useEffect(()=>{
        setWidth(inputRef.current.offsetWidth);
        setWidth2(inputRef2.current.offsetWidth);
    },[])

    useEffect(()=>{
        updateConverter1();
        updateConverter2();

    
    },[input1,input2])

    //Handle input
    function containsOnlyNumbers(str) {
        // return /^\d+$/.test(str);
        // return /^[\d|\.]/.test(str);
        return /^\d+$/.test(str) || /\./.test(str);

    }

    function handleChange(event){
        if(event.target.id == "firstinput" || event.target.id == "one"){
            setInputUSDisplay("inline");
        
            // console.log("Event: ",parseFloat(event.target.value));
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
                    // console.log("Prevlenght = ",previnput.length, " current length: ",event.target.value.length)
                    if(previnput.length <= event.target.value.length){
                        setWidth(width + 8);
                    }
                    else{
                        // console.log("SHRIKINg");
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
                    // console.log("Calling");
                    getARPprice(event.target.value).then((outputARP)=>{
                        // console.log("Returned");
                        const formattedOutput = ethers.utils.formatUnits(outputARP._hex, "ether");
                        //ETH to ARP
                        // const floatETH = parseFloat(event.target.value);
                        // const arpvalue = noARPperETH * floatETH;

                        setinput2((formattedOutput).toString().slice(0,9));
                        setInputUSDisplay2("inline");
                        updateWidth((formattedOutput).toString().slice(0,9), 2);
                    });
                }
                else if(tickerSymbol1 =="ARP"){ 
                    const floatARP = parseFloat(event.target.value);
                    const lastValue = event.target.value[event.target.value.length-1];
                    const parsedARP = lastValue < 5?Math.floor(floatARP):Math.ceil(floatARP);

                    getEthPrice(parsedARP).then((outputETH)=>{
                        const _parsedEth = ethers.utils.formatUnits(outputETH._hex,"ether");
                        console.log("ARP parsed Value: ", _parsedEth);
                        setinput2(_parsedEth.toString().slice(0,7));
                        setInputUSDisplay2("inline");
                        updateWidth(_parsedEth.toString().slice(0,7),2);


                    })


                    // const ethvalue = floatARP * ARPrate;
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
                    getARPprice(event.target.value).then((outputARP)=>{
                        const formattedOutput = ethers.utils.formatUnits(outputARP._hex, "wei");
                        setinput1((formattedOutput).toString().slice(0,9));
                        setInputUSDisplay("inline");
                        updateWidth((formattedOutput).toString().slice(0,9), 1);
                    });                 
                    // const floatETH = parseFloat(event.target.value);
                    // const arpvalue = noARPperETH * floatETH;
                    // setinput1((arpvalue).toString().slice(0,9));
                    // setInputUSDisplay("inline");
                    // updateWidth((arpvalue).toString().slice(0,12), 1);

                }
                else if(tickerSymbol2 == "ARP"){

                    const floatARP = parseFloat(event.target.value);
                    const lastValue = event.target.value[event.target.value.length-1];
                    const parsedARP = lastValue < 5?Math.floor(floatARP):Math.ceil(floatARP);

                    getEthPrice(parsedARP).then((outputETH)=>{
                        const _parsedEth = ethers.utils.formatUnits(outputETH._hex,"ether");

                        console.log("ARP parsed Value: ", _parsedEth);
                        setinput1(_parsedEth.toString().slice(0,7));
                        setInputUSDisplay("inline");
                        updateWidth(_parsedEth.toString().slice(0,7),1);
                    })
                    // const floatARP = parseFloat(event.target.value);
                    // const ethvalue = floatARP * ARPrate;
                    // setinput1(ethvalue.toString().slice(0,9));
                    // setInputUSDisplay("inline");
                    // updateWidth(ethvalue.toString().slice(0,9),1);

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
    // console.log("Widht2: ",width2);

    function handleParentDiv(event){
        // console.log(event.target.id);
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
        const AraswapExchangeContract = new ethers.Contract("0x02A011A6Ce08d22c82Cf7a564e0AD86FC7129133", ARASWAPABI,signer);

        //Adding liquidity

        try{

            //Parsing ARPtoken
            const ArpTokenAmount = tickerSymbol1 == "ETH"?input2:input1;
            const floatARPToken = parseFloat(ArpTokenAmount);
            const lastValue = ArpTokenAmount[ArpTokenAmount.length-1];
            const parsedARP = lastValue < 5?Math.floor(floatARPToken):Math.ceil(floatARPToken);
            const bigARP = ethers.BigNumber.from(parsedARP.toString());
            const big10 = ethers.BigNumber.from("10");
            const big18 = ethers.BigNumber.from("18");
            const bigMultiple = big10.pow(big18);
            // console.log("To aprove arp",Number(parsedARP* (10**18)));
            
            //Parsing Ether to BigNumber 
            const etherAmount = tickerSymbol1 =="ETH"?input1:input2;
            const parsedEther = ethers.utils.parseEther(etherAmount);
    
    
            //Calling function

            const approveTransaction = await ArpTokenContract.approve("0x02A011A6Ce08d22c82Cf7a564e0AD86FC7129133",bigARP.mul(bigMultiple));
            await approveTransaction.wait();
            console.log(approveTransaction);

            const LPTokens = await AraswapExchangeContract.addLiquidity(Number(parsedARP), {value: parsedEther,gasLimit: 150008});
                
            return LPTokens;

        }
        catch(error){
            console.error(error);
        }

    }

    //Returns ARP output token
    async function getARPprice(value){
        const AraswapExchangeContract = new ethers.Contract("0x02A011A6Ce08d22c82Cf7a564e0AD86FC7129133", ARASWAPABI,provider);
        
        //Getting ARP reserve of the contract
        const ContractARPreserve = await AraswapExchangeContract.getReserve();
        // const formattedARPReserve = ethers.utils.formatUnits(ContractARPreserve._hex,"wei");
        // ContractARPreserve.wait();

        //Getting ETH reserve of the contract
        const ContractEthReserve =  await provider.getBalance("0x02A011A6Ce08d22c82Cf7a564e0AD86FC7129133");
        const formattedETHReserve = ethers.utils.formatUnits(ContractEthReserve._hex, "wei");
        
        // ContractEthReserve.wait();

        // //Calculating ouput ARP amount
        const ARPamount = await AraswapExchangeContract.getOutputTokenAmount(ethers.utils.parseEther(value), formattedETHReserve,ContractARPreserve);
        // ARPamount.wait();

        // console.log("ARP amount to be received",ethers.utils.formatUnits(ARPamount._hex,"wei"));
        return ARPamount;
    }

    //Returns ETH output token
    async function getEthPrice(_arpToSell){
        // console.log("To fetch");
        const AraswapExchangeContract = new ethers.Contract("0x02A011A6Ce08d22c82Cf7a564e0AD86FC7129133", ARASWAPABI,provider);
        
        //Getting ARP reserve of the contract
        const ContractARPreserve = await AraswapExchangeContract.getReserve();

        const bigARP = ethers.BigNumber.from(_arpToSell.toString());
        const big10 = ethers.BigNumber.from("10");
        const big18 = ethers.BigNumber.from("18");
        const bigMultiple = big10.pow(big18);
        const formattedARPToSell = bigARP.mul(bigMultiple);
        

        console.log("ARP TO SELLL: ", formattedARPToSell);
        // ContractARPreserve.wait();

        //Getting ETH reserve of the contract
        const ContractEthReserve =  await provider.getBalance("0x02A011A6Ce08d22c82Cf7a564e0AD86FC7129133");
        const formattedETHReserve = ethers.utils.formatUnits(ContractEthReserve._hex, "wei");
        
        // console.log("Reserve already fetched");
        // //Calculating ouput ARP amount
        const ETHamount = await AraswapExchangeContract.getOutputTokenAmount(formattedARPToSell, ContractARPreserve,formattedETHReserve);
        // ARPamount.wait();

        console.log("ETH amount to be received for ARP: ",_arpToSell," ETH: ",ethers.utils.formatUnits(ETHamount._hex,"ether"));
        return ETHamount;

    }

    function roundOff(arp){

        const arpToSell = parseFloat(arp);
        const floatARPToSell = parseFloat(arpToSell);
        const lastValue = arpToSell[arpToSell.length-1];
        const parsedARP = lastValue < 5?Math.floor(floatARPToSell):Math.ceil(floatARPToSell);

        return parsedARP;

    }

    //Swap Tokens
    async function SwapTokens(){

        //Check if the amount is greater than balance or not
        if(parseFloat(input1) >= parseFloat(balance1)){

            console.log("whsowing notification");
            showNotification({
                title: 'Oopise 🤥',
                message: "The amount you're trying to sell is greater than your balance",
                color:'red',
                disallowClose:true,
                style: { 
                    backgroundColor: "#202231",
                },
                styles: (theme)=>({
                    root: {
                        borderColor:"#202231",
        
                    },
                    title:{color:theme.white},
                })
            });
            return;
        }

        //Showing notification
        showNotification({
            id: "swap",
            loading:true,
            title: 'Swapping 🤥',
            message: "Please wait till tokens are swapped",
            color:'teal',
            disallowClose:true,
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
        });

        try{
            const signer  = provider.getSigner();
            console.log("Signer: ",signer);
            //Contract instance
            const ArpTokenContract = new ethers.Contract("0x9E9adC71262AB77b460e80d41Dded76dD43407e9",ABI,signer);
            const AraswapExchangeContract = new ethers.Contract("0x02A011A6Ce08d22c82Cf7a564e0AD86FC7129133", ARASWAPABI,signer);

            if(tickerSymbol1 == "ETH"){

                //Get the output amount

                console.log("upper check");
                const minimumAmount = parseFloat(input2.slice(0,9)) - (0.1 * parseFloat(input2.slice(0,9))); //Just in case
                const roundedMnimumAmount = roundOff(minimumAmount.toString());
                console.log("Rounded ARP: ",roundedMnimumAmount);
                //Swapping
                const tx = await AraswapExchangeContract.swapFromEth(Number(roundedMnimumAmount),{
                    value: ethers.utils.parseEther(input1.slice(0,9)),
                    gasLimit: 150008
                });
                tx.wait();

                // //Mantine
                updateNotification({
                    id:"swap",
                    color: 'teal',
                    title: 'Swap successfull',
                    message: 'Tokens have been successfully swapped',
                    icon: <IconCheck size={16} />,
                    autoClose: 2000,
                    disallowClose: true,
                    style: { 
                        backgroundColor: "#202231",
                    },
                    styles: (theme)=>({
                        root: {
                            borderColor:"#202231",
            
                        },
                        title:{color:theme.white},
                    }),
                });
                // alert("Swap Successfull");  
                console.log(tx);  
            }
            else if(tickerSymbol1 == "ARP"){
                //Minimum eth
                const minimumEth = parseFloat(input2) - (0.1 * parseFloat(input2));
                const parsedMinimumETH = ethers.utils.parseEther(minimumEth.toString(), "wei");

                //Arp to sell
                const roundedARP = roundOff(input1);
                const bigARP = ethers.BigNumber.from(roundedARP.toString());
                const big10 = ethers.BigNumber.from("10");
                const big18 = ethers.BigNumber.from("18");
                const bigMultiple = big10.pow(big18);
                const _parsedRounedArp = bigARP.mul(bigMultiple);

                //Approving txn
                const approvetxn = await ArpTokenContract.approve("0x02A011A6Ce08d22c82Cf7a564e0AD86FC7129133",_parsedRounedArp);
                approvetxn.wait();
                
                const tx2 = await AraswapExchangeContract.swapToEth(Number(roundedARP),parsedMinimumETH);
                tx2.wait();

                // //Mantine
                updateNotification({
                    id:"swap",
                    color: 'teal',
                    title: 'Swap successfull',
                    message: 'Tokens have been successfully swapped',
                    icon: <IconCheck size={16} />,
                    autoClose: 2000,
                    disallowClose: true,
                    style: { 
                        backgroundColor: "#202231",
                    },
                    styles: (theme)=>({
                        root: {
                            borderColor:"#202231",
            
                        },
                        title:{color:theme.white},
                    }),
                });
                console.log(tx2);           
        
            }
        }
        catch(error){   

        // //Mantine
            updateNotification({
                id:"swap",
                color: 'red',
                title: 'Oopsie',
                message: 'Error occured try again',
                icon: <IconX size={16} />,
                autoClose: 2000,
                disallowClose: true,
                style: { 
                    backgroundColor: "#202231",
                },
                styles: (theme)=>({
                    root: {
                        borderColor:"#202231",
        
                    },
                    title:{color:theme.white},
                }),
        });


        }

    }

    console.log("Input1 changed", input1);

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
                        {/* <span ref={inputUSD} style={{display:`${inputUSDisplay}` }}>~${tickerSymbol1 == "ETH"?(input1*ETHPrice).toString().slice(0,10): (input1 *ARPrate* ETHPrice).toString().slice(0,11) }</span> */}
                        <span ref={inputUSD} style={{display:`${inputUSDisplay}` }}>~${converter1}</span>

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
                        {/* <span ref={inputUSD2} style={{display:`${inputUSDisplay2}` }}>~${tickerSymbol2 == "ETH"?(input2*ETHPrice).toString().slice(0,10): (input2 *ARPrate* ETHPrice).toString().slice(0,11)}</span> */}
                        <span ref={inputUSD} style={{display:`${inputUSDisplay}` }}>~${converter2}</span>

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