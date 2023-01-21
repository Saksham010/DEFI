function CheckWallet(){

    if (typeof window.ethereum !== 'undefined') {
        console.log('MetaMask is installed!');
    }

      
}
module.exports = [CheckWallet];