import axios from 'axios'
import Contract from '../../../../abis/DeveloperDAOforUkraine.json'
import { inject } from 'vue'
import { CONTRACT_TOKEN, CONTRACT_NETWORK } from '../../constants'
import { ethers } from 'ethers'

let cachedTierPrices = {}

export default function useContract() {
    const client = inject('web3client')

    return {
        async mint(tier) {
            const value = ethers.utils.parseEther(tier.price.toString())
            const transaction = await client
                .contract(CONTRACT_TOKEN, Contract.abi)
                .mint({ value })
                .catch(normalizeContractError)

            const result = await transaction
                .wait()
                .catch(normalizeContractError)
            const event = result.events.find(
                (event) => event.event === 'LogTokenMinted'
            )

            return parseInt(event.args[1].toString())
        },

        async getTierPrice(tier) {
            if (typeof cachedTierPrices[tier] === 'undefined') {
                const price = ethers.utils.formatEther(
                    await client
                        .readContract(
                            CONTRACT_TOKEN,
                            Contract.abi,
                            CONTRACT_NETWORK.ensAddress
                        )
                        .tiers(tier)
                )

                cachedTierPrices[tier] =
                    parseInt(price) > 0
                        ? Math.round(parseInt(price))
                        : parseFloat(price)
            }

            return cachedTierPrices[tier]
        },

        // getOwnerOf(token) {
        //     return client
        //         .contract(CONTRACT_TOKEN, Contract.abi)
        //         .ownerOf(token)
        //         .catch(() => null)
        // },
        //
        getTokenUri(token) {
            return client
                .contract(CONTRACT_TOKEN, Contract.abi)
                .tokenURI(token)
                .catch(() => null)
        },
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
