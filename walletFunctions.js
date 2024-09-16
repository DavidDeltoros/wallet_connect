// Initialize web3 for wallet functions
if (typeof window.ethereum !== 'undefined') {
    window.web3 = new Web3(window.ethereum);
    console.log('MetaMask is available.');
} else {
    console.log('MetaMask not detected.');
}

// Function to connect the wallet
async function connectWallet() {
    if (window.ethereum) {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            account = accounts[0];
            document.getElementById('walletAddress').innerText = `Wallet Address: ${account}`;
            // Display balance
            getBalance();
            document.getElementById('sendSection').style.display = 'block';
        } catch (error) {
            console.error('User rejected the request.');
        }
    } else {
        alert('Please install MetaMask.');
    }
}

// Function to get wallet balance
async function getBalance() {
    const balance = await web3.eth.getBalance(account);
    const bnbBalance = web3.utils.fromWei(balance, 'ether');
    document.getElementById('walletBalance').innerText = `BNB Balance: ${bnbBalance}`;
}

// Function to send BNB
async function send() {
    const amount = document.getElementById('amount').value;
    if (amount) {
        try {
            const transactionParameters = {
                to: '0xReceiverAddress', // replace with receiver address
                from: account,
                value: web3.utils.toHex(web3.utils.toWei(amount, 'ether')),
            };
            await ethereum.request({
                method: 'eth_sendTransaction',
                params: [transactionParameters],
            });
            alert('Transaction Sent!');
        } catch (error) {
            console.error('Transaction failed', error);
        }
    } else {
        alert('Please enter an amount.');
    }
}
