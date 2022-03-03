import { watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default function useRouteParameterSync(previewState) {
    const route = useRoute()
    const router = useRouter()

    onMounted(() => {
        if (route.query.variant) {
            previewState.selectByName(route.query.variant)
        }
    })

    watch(previewState.selected, (selected) => {
        router.push({
            path: '/',
            query: {
                ...route.query,

                variant: selected.name,
            },
        })
    })
}
