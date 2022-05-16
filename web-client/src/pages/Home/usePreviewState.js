import { computed, ref, watchEffect } from 'vue'
import useTiers from './useTiers'

export default function usePreviewState() {
    const tiers = useTiers()
    const selectedName = ref('bronze')
    const selected = computed(() => {
        return selectedName.value
            ? tiers.value.find((tier) => tier.name === selectedName.value)
            : null
    })
    const selectedPriceInDollars = computed(() => {
        const maticToUsd = 0.6; // value to multiple MATIC by to get USD
        return selected.value && selected.value.price !== null
            ? Math.round(selected.value.price * maticToUsd)
            : null
    })

    function selectByName(name) {
        const match = tiers.value.find((variant) => variant.name === name)

        if (match) {
            selectedName.value = match.name
        }
    }

    return {
        selected,
        selectedName,
        selectedPriceInDollars,
        tiers,
        selectByName,
    }
}
