import { watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default function useRouteParameterSync(previewState) {
    const route = useRoute()
    const router = useRouter()

    onMounted(() => {
        if (route.query.tier) {
            previewState.selectByName(route.query.tier)
        }
    })

    watch(previewState.selected, (selected) => {
        router.push({
            path: '/',
            query: {
                ...route.query,

                tier: selected.name,
            },
        })
    })
}
