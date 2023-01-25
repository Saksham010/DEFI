import { Link } from "react-router-dom"
import "./navbar.css";
import logo from "./Araswap.png";

export default function Navbar(){


    return(
        <div className="navbar">
            <div className="logoContainer">

                <Link to ='/'><img src={logo}></img></Link>
            </div>
            {/* <Link to="/"><h1>Araswap</h1></Link> */}

            
            <Link to="/add"><h4>Add Liquidity</h4></Link>

            <div className="linkButton">
                <Link to='/connect'><button>Connect Wallet</button></Link>
            </div>
        </div>
    )

}