var account;
var provider;
var web3;

// Function to detect MetaMask and trigger the connection pop-up
var connectMetaMask = async () => {
  if (typeof window.ethereum !== "undefined") {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" }); // Trigger MetaMask pop-up
      web3 = new Web3(window.ethereum); // Connect to MetaMask
      var accounts = await web3.eth.getAccounts();
      account = accounts[0];
      document.getElementById("address").innerHTML = account;

      var balance = await web3.eth.getBalance(account);
      console.log("See your address:", account);
      console.log("Your balance:", web3.utils.fromWei(balance, "ether"));
    } catch (error) {
      console.log("MetaMask connection failed:", error);
    }
  } else {
    console.log("MetaMask not installed. Please install MetaMask extension.");
  }
};

var connectWC = async () => {
  provider = new WalletConnectProvider.default({
    rpc: {
      56: "https://bsc-dataseed.binance.org/",
    },
  });

  await provider.enable();
  web3 = new Web3(provider);

  var accounts = await web3.eth.getAccounts();
  account = accounts[0];
  document.getElementById("address").innerHTML = account;

  var balance = await web3.eth.getBalance(account);
  console.log("See your address:", account);
  console.log("Your balance:", web3.utils.fromWei(balance, "ether"));
};

var send = async () => {
  if (web3) {
    try {
      var toAddress = document.getElementById("indent").value;
      const transaction = await web3.eth.sendTransaction({
        from: account,
        to: toAddress,
        value: web3.utils.toWei("0.001", "ether"),
      });
      console.log("Transaction successful:", transaction);
    } catch (error) {
      console.log("Transaction failed:", error);
    }
  } else {
    console.log("Web3 instance not available.");
  }
};

var disconnect = async () => {
  if (provider) {
    await provider.disconnect();
    console.log("WalletConnect provider disconnected");
  } else {
    console.log("No WalletConnect provider found.");
  }
};

// Example: connectMetaMask(); // Uncomment this to connect MetaMask by default
