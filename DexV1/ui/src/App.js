import './App.css';
// require("dotenv").config({ path: ".env" });

import {Route, Routes} from "react-router-dom"; 
import Connect from "./components/connectWallet/connect";
import Homepage from "./components/homepage/homepage";
import Navbar from './components/navbar/navbar';
import AddLiquidity from './components/addLiquidity/addLiquidity';
function App() {

  return (


    <div className="App">
      <Navbar/>

      <Routes>
        <Route path='/' element={<Homepage/>} />
        <Route  path='/connect' element={<Connect/>} />
        <Route path='/add' element={<AddLiquidity/>} />

      </Routes>


    </div>


  );
}

export default App;
