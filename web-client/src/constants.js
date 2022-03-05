export const INFURA_ID = process.env.VUE_APP_INFURA_ID
export const OPEN_SEA_URL = process.env.VUE_APP_OPEN_SEA_URL
export const CONTRACT_TOKEN = process.env.VUE_APP_CONTRACT_TOKEN
export const CONTRACT_NETWORK = {
    name: process.env.VUE_APP_CONTRACT_NETWORK_NAME,
    chainId: parseInt(process.env.VUE_APP_CONTRACT_NETWORK_CHAIN_ID ?? 0),
    ensAddress: process.env.VUE_APP_CONTRACT_NETWORK_RPC,
    blockExplorer: process.env.VUE_APP_CONTRACT_NETWORK_BLOCK_EXPLORER,
    currencySymbol: 'MATIC',
}

export const TIER_NAMES = [
    'steel',
    'bronze',
    'silver',
    'gold',
    'diamond',
    'platinum',
]

// export const TIERS = [
//     { name: 'Bronze', price: 9 },
//     { name: 'Silver', price: 29 },
//     { name: 'Gold', price: 79 },
//     { name: 'Diamond', price: 199 },
//     { name: 'Platinum', price: 499 },
// ]
//
// if (process.env.VUE_APP_TEST_AMOUNTS) {
//     TIERS.forEach((tier) => {
//         tier.price = tier.price / 800
//     })
// }
