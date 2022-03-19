import { ref } from 'vue'
import useContract from './useContract'
import { TIER_NAMES } from '../../constants'

export default function useTiers() {
    const contract = useContract()
    const tiers = ref(TIER_NAMES.map((name) => ({
        name,
        preview_src: `/assets/preview/${name}.png`,
        price: null
    })))

    const fetchPrices = async () => {
        const prices = await Promise.all(
            TIER_NAMES.map((name) => contract.getTierPrice(name))
        )

        prices.forEach((price, index) => (tiers.value[index].price = price))
    }

    fetchPrices()

    return tiers
}
