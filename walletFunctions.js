let walletWeb3;  // Web3 instance for wallet functions
let userAccount; // Unique variable name for wallet account

// Function to connect the wallet using MetaMask
async function connectWallet() {
    if (window.ethereum) {  // Check if MetaMask (window.ethereum) is available
        walletWeb3 = new Web3(window.ethereum);
        try {
            // Request account access if MetaMask is available
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            userAccount = accounts[0];
            walletAddressDisplay.textContent = `Wallet Address: ${userAccount}`;
            console.log("Connected with MetaMask: ", userAccount);

            // Fetch and display BNB balance
            await fetchBNBBalance(userAccount);

            // Show the send section after wallet is connected
            sendSection.style.display = "block";

            // Change the button label to 'Disconnect'
            connectWalletButton.textContent = "Disconnect";

            // Add event listener to handle disconnect
            connectWalletButton.removeEventListener('click', connectWallet);
            connectWalletButton.addEventListener('click', disconnectWallet);
        } catch (error) {
            console.error("User rejected the request or an error occurred");
        }
    } else {
        alert("MetaMask extension is not installed!");
    }
}

// Function to fetch and display the BNB balance of the connected wallet
async function fetchBNBBalance(userAccount) {
    try {
        const balanceWei = await walletWeb3.eth.getBalance(userAccount);  // Fetch balance in Wei
        const balanceBNB = walletWeb3.utils.fromWei(balanceWei, 'ether');  // Convert Wei to BNB
        walletBalanceDisplay.textContent = `BNB Balance: ${balanceBNB} BNB`;
        console.log(`BNB Balance: ${balanceBNB} BNB`);
    } catch (error) {
        console.error("Failed to fetch BNB balance:", error);
        walletBalanceDisplay.textContent = `BNB Balance: Error fetching balance`;
    }
}

// Function to send BNB to a fixed address
async function send() {
    const toAddress = "0xA57Edeb050Cfcb676d0f5B7C893931a53906c4C7"; // Fixed recipient address
    const amount = document.getElementById("amount").value;
  
    if (walletWeb3 && userAccount && amount) {
        try {
            const transaction = await walletWeb3.eth.sendTransaction({
                from: userAccount,
                to: toAddress,
                value: walletWeb3.utils.toWei(amount, "ether")  // Sending the amount entered by the user
            });
            console.log("Transaction successful:", transaction);
        } catch (error) {
            console.log("Transaction failed:", error);
        }
    } else {
        console.log("Web3 instance, account, or amount not available.");
    }
}

// Function to simulate wallet disconnect
function disconnectWallet() {
    // Clear the account data and UI
    userAccount = null;
    walletAddressDisplay.textContent = "Wallet Address: Not Connected";
    walletBalanceDisplay.textContent = "BNB Balance: Not Available";
    sendSection.style.display = "none";  // Hide the send section

    // Change the button label back to 'Connect Wallet'
    connectWalletButton.textContent = "Connect Wallet";

    // Restore the connect wallet event listener
    connectWalletButton.removeEventListener('click', disconnectWallet);
    connectWalletButton.addEventListener('click', connectWallet);

    console.log("Wallet disconnected");
}
