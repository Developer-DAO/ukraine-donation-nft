import { computed, ref } from 'vue'
import useContract from './useContract'
import { CONTRACT_TOKEN, TIER_NAMES } from '../../constants'
import Contract from '../../../../abis/PixelDevsUkraineDonation.json'
import { ethers } from 'ethers'

export default function useTiers() {
    const contract = useContract()
    const tiers = ref(TIER_NAMES.map((name) => ({ name, price: null })))

    const fetchPrices = async () => {
        const prices = await Promise.all(
            TIER_NAMES.map((name) => contract.getTierPrice(name))
        )

        prices.forEach((price, index) => (tiers.value[index].price = price))
    }

    fetchPrices()

    return tiers

    // return {
    //     tiers,
    //
    //     get(name) {
    //
    //     }
    // }
    //
    // tiers.forEach((tier, index) => contract.getTierPrice())
    //
    // const promises =
    //
    // client.readContract(CONTRACT_TOKEN, Contract.abi).tiers(name)
    // const prices = await Promise.all(promises)
    //
    // cachedTiers = prices.map((price, index) => ({
    //     name: TIERS[index],
    //     price: ethers.utils.formatEther(price)
    // }))
    //
    // contract.getTiers().then(_tiers => {
    //     tiers.value = _tiers
    //
    //     selected.value = _tiers[2]
    // })
    //
    // function selectByName(name) {
    //     const match = tiers.value.find((variant) => variant.name === name)
    //
    //     if (match) {
    //         selected.value = match
    //     }
    // }
    //
    // return {
    //     selectByName,
    //     selected,
    //     selectedPriceInDollars,
    //     tiers,
    // }
}
