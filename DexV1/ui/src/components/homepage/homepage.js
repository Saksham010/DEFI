
export default function Homepage(){
    
    if (typeof window.ethereum !== 'undefined') {
        console.log('MetaMask is installed!');
      }
      

    return(
        <div>
            Homepage

        </div>
    )
}