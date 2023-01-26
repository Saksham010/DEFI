import { Link } from "react-router-dom"
import "./navbar.css";
import logo from "./Araswap.png";
import { useCookies } from "react-cookie";

export default function Navbar(){

    //Cookies
    const [cookies,setCookie,removeCookie] = useCookies(['WalletAddress']);

    function disconnectWallet(){
        removeCookie("WalletAddress");

    }
    const content = cookies.WalletAddress == undefined?<Link to='/connect'><button>Connect Wallet</button></Link>:<button onClick={disconnectWallet}>{cookies.WalletAddress.slice(0,12)}...</button>;
    
    return(
        <div className="navbar">
            <div className="logoContainer">

                <Link to ='/'><img src={logo}></img></Link>
            </div>
            {/* <Link to="/"><h1>Araswap</h1></Link> */}

            
            <Link to="/add"><h4>Add Liquidity</h4></Link>

            <div className="linkButton">
                {content}
            </div>
        </div>
    )

}