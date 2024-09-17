const wbnbAddress = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c';     // WBNB address
const usdtAddress = '0x55d398326f99059fF775485246999027B3197955';     // USDT address

// Function to get the BNB price in USDT
async function getBnbPrice() {
    try {
        // Fetch liquidity of USDT/WBnB pair
        const { tokenLiquidity: usdtLiquidity, wbnbLiquidity: wbnbLiquidityUSDT } = await getLiquidity(usdtAddress, wbnbAddress);

        // Calculate the BNB price in USDT
        const bnbPrice = usdtLiquidity / wbnbLiquidityUSDT/1000000000;

        return bnbPrice;
    } catch (error) {
        console.error('Error fetching BNB price:', error);
        return null;
    }
}
