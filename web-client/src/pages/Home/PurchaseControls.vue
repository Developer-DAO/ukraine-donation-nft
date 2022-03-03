<script setup>
import Alert from '../../components/ui/Alert.vue'
import Button from '../../components/ui/Button.vue'
import InsufficientFundsModal from '../../components/InsufficientFundsModal'
import ShareModal from '../../components/ShareModal'
import useContract from './useContract'
import { computed, inject, ref, watch } from 'vue'
import { CheckIcon } from '@heroicons/vue/outline'
import Spinner from '../../components/ui/Spinner'

const CLAIMING_STATES = Object.freeze({
    IDLE: 'idle',
    LOADING: 'loading',
    SUCCESS: 'success',
    ERROR: 'error',
})

const client = inject('web3client')
const previewState = inject('previewState')
const contract = useContract()

const purchaseState = ref(CLAIMING_STATES.IDLE)
const purchaseToken = ref(null)
const purchaseTokenIsMinted = computed(() => {
    return false
    // return findTokenInInventory(purchaseToken.value)?.minted === true
})
const purchaseButtonDisabled = computed(() => {
    return (
        [CLAIMING_STATES.LOADING, CLAIMING_STATES.SUCCESS].indexOf(
            purchaseState.value
        ) > -1
    )
})
const errorMessage = ref(null)
const showModal = ref(null)

async function startClaiming() {
    try {
        purchaseState.value = CLAIMING_STATES.LOADING

        await contract.mint(previewState.selected.value)

        purchaseState.value = CLAIMING_STATES.SUCCESS
        errorMessage.value = null
        showModal.value = null

        // Show share modal
        showModal.value = 'share'
    } catch (error) {
        purchaseState.value = CLAIMING_STATES.ERROR
        errorMessage.value = error.message

        if (errorMessage.value.includes('insufficient funds')) {
            errorMessage.value = 'Insufficient funds in wallet.'
            showModal.value = 'insufficient_funds'
        }
    }
}

function closeModal() {
    showModal.value = null
}

// Automatically set purchaseToken based on previewState
// watch(previewState.developer, (developer) => {
//     const token = parseInt(developer)
//
//     if (token === parseInt(purchaseToken.value) && !isNaN(token)) {
//         return
//     }
//
//     if (findTokenInInventory(token)) {
//         return (purchaseToken.value = token)
//     }
//
//     purchaseToken.value = null
// })

// Load available tokens + mint price when connected to wallet
watch(client.isConnected, async (isConnected) => {
    if (isConnected) {
        purchaseState.value = CLAIMING_STATES.IDLE
        purchaseToken.value = null
        errorMessage.value = null
        // availableTokens.value = await contract.getAvailableTokens()
        // mintPriceEther.value = await contract.getMintPriceInEther()

        // if (availableTokens.value.length === 0) {
        //     showModal.value = 'empty_inventory'
        // } else {
        //     purchaseToken.value = findTokenInInventory(
        //         previewState.developer.value
        //     )
        //         ? previewState.developer.value
        //         : availableTokens.value[0].token
        //
        //     updatePreview()
        // }
    }
})
</script>

<template>
    <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-200 ease-out"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
    >
        <div v-if="client.isConnected.value">
            <transition-group
                enter-active-class="transition duration-100 ease-out"
                enter-from-class="transform scale-95 opacity-0"
                enter-to-class="transform scale-100 opacity-100"
                leave-active-class="transition duration-100 ease-out"
                leave-from-class="transform scale-100 opacity-100"
                leave-to-class="transform scale-95 opacity-0"
            >
                <Alert
                    v-if="purchaseTokenIsMinted"
                    class="mt-3 flex items-center space-x-1"
                    color="green"
                >
                    <span>Successfully minted</span>
                    <CheckIcon class="w-4 h-4" />
                </Alert>

                <Alert
                    v-if="errorMessage"
                    class="mt-3"
                    style="overflow-wrap: anywhere"
                >
                    Error: {{ errorMessage }}
                </Alert>
            </transition-group>

            <div class="mt-4 flex items-center justify-end">
                <Spinner
                    v-if="purchaseState === CLAIMING_STATES.LOADING"
                    class="w-4 h-4 mr-4"
                />

                <Button
                    class="w-full max-w-[12rem]"
                    :disabled="purchaseButtonDisabled"
                    @click="startClaiming()"
                >
                    <span v-if="purchaseState === CLAIMING_STATES.LOADING">
                        Claiming...
                    </span>
                    <span v-else>Claim avatar</span>
                </Button>
            </div>

            <InsufficientFundsModal
                :show="showModal === 'insufficient_funds'"
                @close="closeModal()"
            />

            <ShareModal
                v-if="purchaseToken"
                :show="showModal === 'share'"
                :token="purchaseToken"
                :confetti="true"
                @close="closeModal()"
            />
        </div>
    </transition>
</template>
