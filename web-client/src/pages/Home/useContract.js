import axios from 'axios'
import Contract from '../../../../abis/PixelDevsUkraineDonation.json'
import {inject, unref} from 'vue'
import { CONTRACT_TOKEN } from '../../constants'
import { ethers } from 'ethers'

export default function useContract() {
    const client = inject('web3client')

    return {
        async mint(tier) {
            const value = ethers.utils.parseEther(tier.price.toString())
            const transaction = await client
                .contract(CONTRACT_TOKEN, Contract.abi)
                .mint({ value })
                .catch(normalizeContractError)

            const result = await transaction.wait().catch(normalizeContractError)
            const event = result.events.find(event => event.event === 'LogTokenMinted')

            return parseInt(event.args[1].toString())
        },

        // getOwnerOf(token) {
        //     return client
        //         .contract(CONTRACT_TOKEN, Contract.abi)
        //         .ownerOf(token)
        //         .catch(() => null)
        // },
        //
        // getTokenUri(token) {
        //     return client
        //         .contract(CONTRACT_TOKEN, Contract.abi)
        //         .tokenURI(token)
        //         .catch(() => null)
        // },
    }
}

function normalizeContractError(error) {
    throw new Error(
        null ??
            error?.error?.data?.originalError?.message ??
            error?.error?.message ??
            error?.data?.message ??
            error?.message
    )
}
