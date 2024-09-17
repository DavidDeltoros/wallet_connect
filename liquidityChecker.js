const web3 = new Web3('https://bsc-dataseed.binance.org/');

// PancakeSwap V2 factory address and ABI
const factoryAddress = '0xca143ce32fe78f1f7019d7d551a6402fc5350c73';
const factoryABI = [
    {
        "constant": true,
        "inputs": [
            {"internalType": "address", "name": "tokenA", "type": "address"},
            {"internalType": "address", "name": "tokenB", "type": "address"}
        ],
        "name": "getPair",
        "outputs": [{"internalType": "address", "name": "pair", "type": "address"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
];

// Pair contract ABI
const pairABI = [
    {
        "constant": true,
        "inputs": [],
        "name": "getReserves",
        "outputs": [
            {"internalType": "uint112", "name": "_reserve0", "type": "uint112"},
            {"internalType": "uint112", "name": "_reserve1", "type": "uint112"},
            {"internalType": "uint32", "name": "_blockTimestampLast", "type": "uint32"}
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
];

// Function to get liquidity
async function getLiquidity(tokenAddress, wbnbAddress) {
    try {
        const factoryContract = new web3.eth.Contract(factoryABI, factoryAddress);
        const pairAddress = await factoryContract.methods.getPair(tokenAddress, wbnbAddress).call();

        if (pairAddress === '0x0000000000000000000000000000000000000000') {
            throw new Error('No liquidity pair found for this token.');
        }

        const pairContract = new web3.eth.Contract(pairABI, pairAddress);
        const reserves = await pairContract.methods.getReserves().call();

        const tokenReserve = tokenAddress.toLowerCase() < wbnbAddress.toLowerCase() ? reserves._reserve0 : reserves._reserve1;
        const wbnbReserve = tokenAddress.toLowerCase() < wbnbAddress.toLowerCase() ? reserves._reserve1 : reserves._reserve0;

        // Convert from wei to token amount (assuming 18 decimals)
        const tokenLiquidity = tokenReserve / (10 ** 9);
        const wbnbLiquidity = wbnbReserve / (10 ** 18);

        return { tokenLiquidity, wbnbLiquidity };
    } catch (error) {
        console.error('Error:', error.message);
        return { tokenLiquidity: 0, wbnbLiquidity: 0 };
    }
}
