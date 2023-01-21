import './App.css';
// require("dotenv").config({ path: ".env" });

import {Route, Routes} from "react-router-dom"; 
import Connect from "./components/connectWallet/connect";
import Homepage from "./components/homepage/homepage";
function App() {

  return (


    <div className="App">

      <Routes>
        <Route path='/' element={<Homepage/>} />
        <Route  path='/connect' element={<Connect/>} />

      </Routes>


    </div>


  );
}

export default App;
