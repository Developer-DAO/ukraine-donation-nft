<script setup>
import { computed, inject, ref, watchEffect } from 'vue'
import { ExternalLinkIcon, ShareIcon } from '@heroicons/vue/outline'
import { OPEN_SEA_URL } from '../../constants'
import useContract from './useContract'
import Address from '../../components/ui/Address'
import ShareModal from '../../components/ShareModal'
import Button from '../../components/ui/Button'
import { useLaunchCounter } from '../../components/LaunchBanner'

// const avatarContract = useAvatarContract()
// const client = inject('web3client')
// const state = inject('previewState')
// const showModal = ref(false)
// const owner = ref(null)
// const ownerLink = computed(() =>
//     owner.value ? `${OPEN_SEA_URL}/${owner.value}` : null
// )
// const ownedByUser = computed(
//     () =>
//         (owner.value ?? '').toLowerCase() ===
//         (client.connectedAddress.value ?? '').toLowerCase()
// )
// const launchCounter = useLaunchCounter()
//
// watchEffect(async () => {
//     const token = state.developer.value
//
//     if (client.isConnected.value) {
//         owner.value = await avatarContract.getOwnerOf(token)
//     }
// })
</script>

<template>
    <div class="space-y-4">
        <img
            src="https://storage.opensea.io/files/82e2d7fa56b8f9bb76e1dca83ee21d26.svg"
            class="rounded-md"
        />
    </div>
</template>
