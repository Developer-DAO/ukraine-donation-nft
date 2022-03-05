import { computed, ref, reactive } from 'vue'
import { TIERS } from '../../constants'

export default function usePreviewState() {
    // const variants = ref([
    //     { name: 'Bronze', price: 9 },
    //     { name: 'Silver', price: 29 },
    //     { name: 'Gold', price: 79 },
    //     { name: 'Diamond', price: 199 },
    //     { name: 'Platinum', price: 499 },
    // ])

    const selected = ref(TIERS[1])
    const selectedPriceInDollars = computed(() => {
        return Math.round(selected.value.price * 1.5)
    })

    function selectByName(name) {
        const match = TIERS.find((variant) => variant.name === name)

        if (match) {
            selected.value = match
        }
    }

    return {
        selectByName,
        selected,
        selectedPriceInDollars,
    }

    // const developer = ref(1)
    // const traits = reactive({})
    // const computer = ref(0)
    // // const layers = computed(() => {
    // //     const orderedTraits = [
    // //         'background',
    // //         'industry',
    // //         'language',
    // //         'location',
    // //         'mind',
    // //         'os',
    // //         'texteditor',
    // //         'vibe',
    // //         'clothing',
    // //     ]
    // //
    // //     return _layers
    // // })
    // //
    // // function updateDeveloper() {
    // //     // Loop through all developers until a full trait match is found
    // //     const _developer = dataDevelopers.find((_developer) => {
    // //         return dataTraits.every((trait) => {
    // //             return (
    // //                 _getTraitSlugFromName(
    // //                     trait,
    // //                     _developer[trait.id] ?? null
    // //                 ) === traits[trait.slug]
    // //             )
    // //         })
    // //     })
    // //
    // //     // Apply developer id. Otherwise reset.
    // //     developer.value = _developer ? _developer.id : null
    // // }
    // //
    // // function updateTraits() {
    // //     // Find developer matching id.
    // //     const _developer = dataDevelopers.find(
    // //         (dev) => parseInt(dev.id) === parseInt(developer.value)
    // //     )
    // //
    // //     // If found developer from current id, apply trait values. Otherwise reset.
    // //     dataTraits.forEach((trait) => {
    // //         traits[trait.slug] = _developer
    // //             ? _getTraitSlugFromName(trait, _developer[trait.id] ?? null)
    // //             : null
    // //     })
    // // }
    // //
    // // function _getTraitSlugFromName(trait, name) {
    // //     return trait.values.find((value) => value.name === name)?.slug
    // // }
    // //
    // // // Initialize
    // // dataTraits.forEach((trait) => (traits[trait.slug] = null))
    // //
    // // updateTraits()
    //
    // return {
    //     computer,
    // }
}
