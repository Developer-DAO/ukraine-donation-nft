<script setup>
import Button from './ui/Button'
import Modal from './ui/Modal'
import MetaMask from '../web3-providers/MetaMask'
import { DialogTitle, DialogDescription } from '@headlessui/vue'
import {
    ArrowRightIcon,
    LockClosedIcon,
    ExclamationIcon,
} from '@heroicons/vue/solid'

import { ref, inject, watch } from 'vue'

const client = inject('web3client')
const show = ref(false)
const open = () => (show.value = true)
const close = () => (show.value = false)

watch(client.isConnected, function (connected) {
    if (connected) {
        close()
    }
})
</script>

<template>
    <div>
        <slot v-bind="{ open }" />

        <Modal :show="show" @close="close()">
            <div>
                <div
                    class="
                        mx-auto
                        flex
                        items-center
                        justify-center
                        h-12
                        w-12
                        rounded-full
                        bg-purple-100
                        text-purple-600
                        dark:bg-purple-500 dark:text-purple-100
                    "
                >
                    <LockClosedIcon class="h-6 w-6" aria-hidden="true" />
                </div>
                <div class="mt-3 text-center sm:mt-5">
                    <DialogTitle
                        as="h3"
                        class="
                            text-lg
                            leading-6
                            font-medium
                            text-gray-900
                            dark:text-gray-100
                        "
                    >
                        Connect your wallet
                    </DialogTitle>
                    <DialogDescription class="mt-3">
                        <p class="text-sm text-gray-500 dark:text-gray-300">
                            Connect with one of our available wallet providers.
                        </p>
                    </DialogDescription>
                </div>
            </div>

            <div class="mt-5 sm:mt-6 space-y-2">
                <Button
                    type="button"
                    class="flex items-center"
                    color="blackOutline"
                    :disabled="!MetaMask.isAvailable()"
                    @click="client.connect(client.supportedProviders.MetaMask)"
                >
                    <img
                        src="/img/metamask.png"
                        class="w-6 h-6 mr-4"
                        alt="MetaMask Logo"
                    />
                    <span class="flex-1 text-left">MetaMask</span>
                    <ExclamationIcon
                        v-if="!MetaMask.isAvailable()"
                        class="w-4 h-4 text-gray-600 dark:text-gray-300"
                    />
                    <ArrowRightIcon
                        v-else
                        class="w-4 h-4 text-gray-600 dark:text-gray-300"
                    />
                </Button>

                <Button
                    type="button"
                    class="flex items-center"
                    color="blackOutline"
                    @click="
                        client.connect(client.supportedProviders.WalletConnect)
                    "
                >
                    <img
                        src="/img/walletconnect.png"
                        class="w-6 h-6 mr-4"
                        alt="Wallet Connect Logo"
                    />
                    <span class="flex-1 text-left">Wallet Connect</span>
                    <ArrowRightIcon
                        class="w-4 h-4 text-gray-600 dark:text-gray-300"
                    />
                </Button>
            </div>
        </Modal>
    </div>
</template>
