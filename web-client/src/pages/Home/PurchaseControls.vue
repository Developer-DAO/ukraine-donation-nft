<script setup>
import Alert from '../../components/ui/Alert.vue'
import Button from '../../components/ui/Button.vue'
import InsufficientFundsModal from '../../components/InsufficientFundsModal'
import ShareModal from '../../components/ShareModal'
import useContract from './useContract'
import { computed, inject, ref, watch } from 'vue'
import { CheckIcon } from '@heroicons/vue/outline'

const PurchaseStates = Object.freeze({
    Idle: 'idle',
    Loading: 'loading',
    Success: 'success',
    Error: 'error',
})

const contract = useContract()
const client = inject('web3client')
const previewState = inject('previewState')
const purchaseState = ref(PurchaseStates.Idle)
const purchasedToken = ref(null)
const errorMessage = ref(null)
const showModal = ref(null)

function openShareModal() {
    showModal.value = 'share'
}

function closeModal() {
    showModal.value = null
}

async function purchase() {
    try {
        purchaseState.value = PurchaseStates.Loading

        purchasedToken.value = await contract.mint(previewState.selected.value)

        purchaseState.value = PurchaseStates.Success
        errorMessage.value = null
        showModal.value = null

        openShareModal()
    } catch (error) {
        purchaseState.value = PurchaseStates.Error
        errorMessage.value = error.message

        if (errorMessage.value.includes('insufficient funds')) {
            errorMessage.value = 'Insufficient funds in wallet.'
            showModal.value = 'insufficient_funds'
        }
    }
}

watch(client.isConnected, async (isConnected) => {
    if (isConnected) {
        purchaseState.value = PurchaseStates.Idle
        purchasedToken.value = null
        errorMessage.value = null
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
                    v-if="purchasedToken"
                    :key="'Alert__success'"
                    class="mb-3 flex items-center space-x-1"
                    color="green"
                >
                    <span>Successfully purchased
                        <b>Developer DAO for Ukraine NFT #{{
                            purchasedToken
                        }}</b></span>
                    <CheckIcon class="w-4 h-4" />
                </Alert>

                <Alert
                    v-if="errorMessage"
                    :key="'Alert__error'"
                    class="mb-3"
                    style="overflow-wrap: anywhere"
                >
                    Error: {{ errorMessage }}
                </Alert>

                <div
                    v-if="purchaseState !== PurchaseStates.Success"
                    :key="'PurchaseButton'"
                >
                    <slot
                        name="purchase"
                        v-bind="{
                            purchase,
                            purchaseState,
                            PurchaseStates,
                            openShareModal,
                        }"
                    />
                </div>
                <div v-else :key="'ShareButton'">
                    <slot name="share" v-bind="{ openShareModal }" />
                </div>
            </transition-group>

            <InsufficientFundsModal
                :show="showModal === 'insufficient_funds'"
                @close="closeModal()"
            />

            <ShareModal
                v-if="purchasedToken"
                :show="showModal === 'share'"
                :token="purchasedToken"
                :confetti="true"
                @close="closeModal()"
            />
        </div>
    </transition>
</template>
