import './App.css';
// require("dotenv").config({ path: ".env" });

import {Route, Routes} from "react-router-dom"; 
import Connect from "./components/connectWallet/connect";
import Homepage from "./components/homepage/homepage";
import Navbar from './components/navbar/navbar';
import AddLiquidity from './components/addLiquidity/addLiquidity';
import {useCookies} from "react-cookie";
import {ethers} from "ethers";


function App() {

  //Cookies
  const [cookies,setCookie] = useCookies(['WalletAddress']);
  console.log("Cookies",cookies);

  function getBalance(){
    
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      provider.getBalance(cookies.WalletAddress).then((balance)=>{
        return balance;
      }).catch((error)=>{
        console.log("Get Balance error: ", error);
        return null;
      })
  }

  return (


    <div className="App">
      <Navbar />

      <Routes>
        <Route path='/' element={<Homepage/>} />
        <Route  path='/connect' element={<Connect />} />
        <Route path='/add' element={<AddLiquidity />} />

      </Routes>



    </div>


  );
}

export default App;
