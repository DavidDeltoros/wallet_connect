let tokenWeb3 = new Web3('https://bsc-dataseed.binance.org/');  // Separate Web3 instance for token functions
let bnbPrice;
let tokenLiquidity, wbnbLiquidity;
let tokenAddress = '0xC481082A2cF65Bf615Bad00202DC2Af186BF5A8e'; // Default token (pw3_UR)

// Token addresses
const tokenAddresses = {
    pw3_UR: '0xC481082A2cF65Bf615Bad00202DC2Af186BF5A8e',
    pw3_CS: '0x524f3879c06b9eadb40fef06686fe4542d74b4ba',
    pw3_NR: '0x36ea6eab634ed5903926cff79bebebfa0e60530a',
};

// Function to handle token selection from the dropdown
function handleTokenChange() {
    const selectedToken = document.getElementById('token-selector').value;
    tokenAddress = tokenAddresses[selectedToken];
    displayLiquidity(); // Update liquidity and token price for selected token
}

// Function to convert BNB to USDT and calculate the difference using value from `sendSection`
function convertBnbToUsdtAndCalculate() {
    const bnbAmount = document.getElementById('amount').value;  // Get value from the sendSection

    if (bnbAmount && bnbPrice) {
        // Convert BNB to USDT
        const usdtValue = bnbAmount * bnbPrice;
        document.getElementById('usdt-value').innerText = usdtValue.toFixed(4);

        // Calculate token result using the equation
        const tokenResult = (wbnbLiquidity * tokenLiquidity) / (parseFloat(wbnbLiquidity) + parseFloat(bnbAmount));

        // Calculate the difference between tokenResult and tokenLiquidity
        const tokenDifference = tokenLiquidity - tokenResult;

        // Display the difference
        document.getElementById('token-difference').innerText = tokenDifference.toFixed(4);
    } else {
        document.getElementById('usdt-value').innerText = "0";
        document.getElementById('token-difference').innerText = "0";
    }
}

// Load the BNB price and token liquidity on page load or token change
async function displayLiquidity() {
    try {
        // Get BNB price using the separate tokenWeb3 instance
        bnbPrice = await getBnbPrice(); // Token web3-specific operation
        if (!bnbPrice) throw new Error("Failed to get BNB price");

        // Get the liquidity for the selected token (token vs WBnB) using tokenWeb3
        const { tokenLiquidity: tokenLiquidityData, wbnbLiquidity: wbnbLiquidityData } = await getLiquidity(tokenAddress, wbnbAddress);

        tokenLiquidity = tokenLiquidityData;
        wbnbLiquidity = wbnbLiquidityData;

        // Calculate token price
        const tokenPrice = (wbnbLiquidity / tokenLiquidity) * bnbPrice;

        // Display liquidity and token price on the webpage
        document.getElementById('token-liquidity').innerText = tokenLiquidity.toFixed(4);
        document.getElementById('wbnb-liquidity').innerText = wbnbLiquidity.toFixed(4);
        document.getElementById('token-price').innerText = tokenPrice.toFixed(4);
    } catch (error) {
        console.error('Error fetching liquidity or token price:', error);
    }
}
