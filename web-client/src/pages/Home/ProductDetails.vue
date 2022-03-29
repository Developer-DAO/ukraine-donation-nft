<script setup>
import { RadioGroup, RadioGroupLabel, RadioGroupOption } from '@headlessui/vue'
import { ExternalLinkIcon } from '@heroicons/vue/outline'
import PolygonLogo from '../../components/ui/PolygonLogo'
import ConnectWalletModal from '../../components/ConnectWalletModal'
import { inject } from 'vue'
import Button from '../../components/ui/Button'
import PurchaseControls from './PurchaseControls'
import Spinner from '../../components/ui/Spinner'
import Alert from '../../components/ui/Alert'
import { useCountdown } from '../../components/CountdownBanner'

const countdown = useCountdown()
const client = inject('web3client')
const state = inject('previewState')
</script>
<template>
    <div
        class="
            max-w-2xl
            mx-auto
            mt-14
            sm:mt-16
            lg:max-w-none lg:mt-0 lg:row-end-2 lg:row-span-2 lg:col-span-4
        "
    >
        <div class="flex flex-col">
            <div class="flex items-center w-full space-x-4">
                <h1
                    class="
                        text-2xl
                        font-extrabold
                        tracking-tight
                        text-gray-900
                        dark:text-gray-100
                        sm:text-3xl
                    "
                >
                    Developer DAO for Ukraine
                </h1>
            </div>

            <div v-if="false" class="mt-2">
                <div class="flex items-center space-x-2">
                    <PolygonLogo class="w-4" />
                    <span class="text-gray-800 text-sm">Polygon</span>
                </div>
            </div>
        </div>

        <p class="text-gray-500 dark:text-gray-400 mt-6">
            The proceeds from purchasing our Ukraine NFT go directly toward
            supporting humanitarian efforts in Ukraine via
            <a
                href="https://unchain.fund"
                target="_blank"
                rel="noopener noreferrer"
            >https://unchain.fund</a>.
        </p>

        <p class="text-gray-500 dark:text-gray-400 mt-6">
            Different donation levels offer NFTs in the form of steel, bronze,
            silver, diamond and platinum. These NFTs may offer additional
            utility on future Developer DAO projects.
        </p>

        <p class="text-gray-500 dark:text-gray-400 mt-6">
            The NFT will be available for minting until June 30th, 2022.
        </p>

        <div class="mt-10">
            <div class="flex items-center justify-start">
                <h3
                    class="text-sm text-gray-900 dark:text-gray-100 font-medium"
                >
                    Select a tier
                </h3>
            </div>

            <RadioGroup v-model="state.selectedName.value" class="mt-4">
                <RadioGroupLabel class="sr-only">
                    Choose a tier
                </RadioGroupLabel>
                <div
                    class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3"
                >
                    <RadioGroupOption
                        v-for="tier in state.tiers.value"
                        v-slot="{ active, checked }"
                        :key="tier.name"
                        :value="tier.name"
                        as="template"
                    >
                        <div
                            :class="[
                                'bg-white shadow-sm text-gray-900 cursor-pointer',
                                active
                                    ? 'ring-2 ring-indigo-500 dark:ring-8 dark:ring-indigo-400'
                                    : '',
                                'group relative border rounded-md py-4 px-4 flex items-center justify-center text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 sm:py-6',
                            ]"
                        >
                            <RadioGroupLabel as="p">
                                {{ tier.name }} &nbsp; {{ tier.price }}
                                <PolygonLogo class="ml-1 inline w-4" />
                            </RadioGroupLabel>
                            <div
                                :class="[
                                    active
                                        ? 'border'
                                        : 'border-2 dark:border-4',
                                    checked
                                        ? 'border-indigo-500 dark:border-indigo-400 dark:ring-2 dark:ring-indigo-400'
                                        : 'border-transparent',
                                    'absolute -inset-px rounded-md pointer-events-none',
                                ]"
                                aria-hidden="true"
                            />
                        </div>
                    </RadioGroupOption>
                </div>
            </RadioGroup>
        </div>

        <div class="mt-10 flex flex items-center justify-between">
            <p class="text-3xl text-gray-900 dark:text-gray-100">
                {{ state.selected.value.price }} MATIC
            </p>
            <span class="text-gray-600">~ about ${{ state.selectedPriceInDollars.value }} USD</span>
        </div>

        <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-4">
            <Alert v-if="countdown.closed.value" color="gray">
                Minting closed.
            </Alert>

            <ConnectWalletModal v-else v-show="!client.isConnected.value">
                <template #default="{ open }">
                    <Button
                        type="button"
                        color="indigo"
                        class="!font-medium !text-base"
                        @click="open"
                    >
                        Connect wallet -->
                    </Button>
                </template>
            </ConnectWalletModal>

            <PurchaseControls v-if="client.isConnected.value">
                <template
                    #purchase="{ purchase, purchaseState, PurchaseStates }"
                >
                    <div class="animate__animated animate__flash">
                        <Button
                            type="button"
                            color="indigo"
                            class="
                                !font-medium
                                !text-base
                                flex
                                justify-center
                                space-x-1
                            "
                            :disabled="purchaseState === PurchaseStates.Loading"
                            @click="purchase"
                        >
                            <span
                                v-if="purchaseState === PurchaseStates.Loading"
                                class="flex items-center justify-center"
                            >
                                <span>Purchasing</span>
                                <Spinner class="w-4 h-4 ml-2" />
                            </span>
                            <span v-else>
                                Purchase {{ state.selected.value.name }} Support
                                NFT -->
                            </span>
                        </Button>
                    </div>
                </template>

                <template #share="{ openShareModal }">
                    <Button
                        type="button"
                        color="blackOutline"
                        class="
                            !font-medium
                            !text-base
                            flex
                            items-center
                            justify-center
                            space-x-1
                        "
                        @click="openShareModal"
                    >
                        <span>Share</span>
                        <ExternalLinkIcon class="w-4 h-4 ml-4" />
                    </Button>
                </template>
            </PurchaseControls>
        </div>

        <div class="border-t border-gray-200 mt-10 pt-10">
            <h3 class="text-sm font-medium text-gray-900 dark:text-gray-100">
                About this NFT
            </h3>
            <div class="mt-4 prose prose-sm text-gray-500 dark:text-gray-400">
                <ul role="list">
                    <li>
                        100% of the donation goes to Ukraine via the Unchain
                        Fund (<a
                            href="https://unchain.fund"
                            target="_blank"
                            rel="noopener noreferrer"
                        >https://unchain.fund</a>)
                    </li>
                    <li>
                        Developer DAO takes no responsibility for the usage of
                        funds through the Unchain Fund.
                    </li>
                </ul>
            </div>
        </div>

        <div class="border-t border-gray-200 mt-10 pt-10">
            <h3 class="text-sm font-medium text-gray-900 dark:text-gray-100">
                Share
            </h3>
            <ul role="list" class="flex items-center space-x-6 mt-4">
                <li>
                    <a
                        href="#"
                        class="
                            flex
                            items-center
                            justify-center
                            w-6
                            h-6
                            text-gray-400
                            hover:text-gray-500
                        "
                    >
                        <span class="sr-only">Share on Facebook</span>
                        <svg
                            class="w-5 h-5"
                            aria-hidden="true"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z"
                                clip-rule="evenodd"
                            />
                        </svg>
                    </a>
                </li>
                <li>
                    <a
                        href="#"
                        class="
                            flex
                            items-center
                            justify-center
                            w-6
                            h-6
                            text-gray-400
                            hover:text-gray-500
                        "
                    >
                        <span class="sr-only">Share on Instagram</span>
                        <svg
                            class="w-6 h-6"
                            aria-hidden="true"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                                clip-rule="evenodd"
                            />
                        </svg>
                    </a>
                </li>
                <li>
                    <a
                        href="#"
                        class="
                            flex
                            items-center
                            justify-center
                            w-6
                            h-6
                            text-gray-400
                            hover:text-gray-500
                        "
                    >
                        <span class="sr-only">Share on Twitter</span>
                        <svg
                            class="w-5 h-5"
                            aria-hidden="true"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84"
                            />
                        </svg>
                    </a>
                </li>
            </ul>
        </div>
    </div>
</template>
<style>
a {
    @apply dark:text-gray-300;
}
</style>
