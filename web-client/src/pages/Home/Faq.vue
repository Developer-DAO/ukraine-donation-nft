<script setup>
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
import { ChevronDownIcon } from '@heroicons/vue/outline'
import { ExternalLinkIcon } from '@heroicons/vue/outline'

const faqs = [
    {
        question: 'What are Pixel Devs?',
        answer: 'They are a derivative NFT on the Polygon Network based on the Genesis Developer DAO NFT: Developers for Revolution. They are a graphical representation of the text-based properties from the Genesis NFT.',
    },
    {
        question: 'Do I become Developer DAO member by purchasing a Pixel Dev?',
        answer: 'No, a Pixel Dev is a Derivative NFT and requires you are already a DAO member. Please follow Developer DAO to stay tuned for further openings.',
    },
    {
        question: 'How do i get a Pixel Dev?',
        answer: 'You need to hold a Genesis NFT to be able to mint a Pixel Dev. You can claim your Pixel Dev on this website by logging in with your wallet after launch. Please note you must login with the same address that holds your Genesis NFT.',
    },
    {
        question: 'What network do we use?',
        answer: 'Pixel Devs are minted on the Polygon Network. Polygon provides lower gas fees making the NFTs more accessible and affordable for our members.',
    },
    {
        question: 'How do i get MATIC on Polygon?',
        answer: "Check out <a href='https://github.com/Developer-DAO/pixel-avatars/wiki/Polygon-MATIC' target='_blank' class='underline'>this guide</a> on the different ways you may acquire MATIC.",
    },
    {
        question: 'How much does a Pixel Dev cost?',
        answer: 'Each Pixel Dev costs 12 MATIC plus gas fees to mint.',
    },
]
</script>

<template>
    <dl class="prose prose-sm max-w-none text-gray-500 space-y-3 divide-y divide-gray-200">
        <Disclosure v-for="faq in faqs" :key="faq.question" v-slot="{ open }" as="div" class="pt-3">
            <dt class="">
                <DisclosureButton class="text-left w-full flex justify-between items-center">
                    <h4>
                        {{ faq.question }}
                    </h4>
                    <span class="ml-6 h-7 flex items-center text-gray-400">
                        <ChevronDownIcon :class="[open ? '-rotate-180' : 'rotate-0', 'h-6 w-6 transform']" aria-hidden="true" />
                    </span>
                </DisclosureButton>
            </dt>
            <DisclosurePanel as="dd" class="mt-2 pr-12">
                <p>
                    {{ faq.answer }}
                </p>
            </DisclosurePanel>
        </Disclosure>
    </dl>
</template>
