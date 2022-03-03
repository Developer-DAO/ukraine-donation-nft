import { CONTRACT_NETWORK } from '../constants'

export default class MetaMask {
    constructor() {
        this.provider = window.ethereum
    }

    async connect(triggerPrompt = false) {
        if (triggerPrompt) {
            await this.provider.request({
                method: 'wallet_requestPermissions',
                params: [
                    {
                        eth_accounts: {},
                    },
                ],
            })
        }

        const [address] = await this.provider.request({
            method: 'eth_requestAccounts',
        })

        return address
    }

    async disconnect() {
        //
    }

    async changeNetwork() {
        const chainId = '0x' + CONTRACT_NETWORK.chainId.toString(16)

        try {
            await this.provider.request({
                method: 'wallet_switchEthereumChain',
                params: [
                    {
                        chainId: chainId,
                    },
                ],
            })
        } catch (switchError) {
            await this.provider.request({
                method: 'wallet_addEthereumChain',
                params: [
                    {
                        chainId: chainId,
                        chainName: CONTRACT_NETWORK.name,
                        rpcUrls: [CONTRACT_NETWORK.ensAddress],
                        nativeCurrency: {
                            name: CONTRACT_NETWORK.currencySymbol,
                            symbol: CONTRACT_NETWORK.currencySymbol,
                            decimals: 18,
                        },
                        blockExplorerUrls: [CONTRACT_NETWORK.blockExplorer],
                    },
                ],
            })
        }
    }

    static isAvailable() {
        return typeof window.ethereum !== 'undefined'
    }
}
