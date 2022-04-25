<script setup>
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
import { ChevronDownIcon } from '@heroicons/vue/outline'
import { ExternalLinkIcon } from '@heroicons/vue/outline'

const faqs = [
    {
        question: 'Where do the proceeds go for the initial mint?',
        answer: `We have selected <a
                href="https://unchain.fund"
                target="_blank"
                rel="noopener noreferrer"
            >https://unchain.fund</a> as the recipient of the proceeds. Donations go to Ukrainian non-profits and humanitarian organizations.`,
    },
    {
        question:
            'Where do the proceeds go if this NFT is later resold on a secondary market?',
        answer: 'If this NFT is resold on OpenSea (or on a market that support ERC2981), the 10% royalties share are sent to the Unchain Fund as a donation.',
    },
    {
        question: 'How are the donations withdrawn?',
        answer: `Developer DAO has several safe-guards in place inside the Smart Contract to ensure donations arrive safely. This includes contract ownership and admin role features.<br/><br/>The contract is administrated by the Developer DAO leadership. Contract administrators are able to change the donation destination and assign roles for those that can withdraw the funds.<br/><br/>If the withdrawal destination changes, it will be recorded on the Polygon blockchain for transparency and traceability.<br/><br/>We also have a 10% Royalty system on OpenSea to ensure that some funds are donated from secondary-market sales.<br/><br/>The funds will arrive at <a
                href="https://unchain.fund"
                target="_blank"
                rel="noopener noreferrer"
            >https://unchain.fund</a> through this process: <ul><li>The Developer DAO will manually withdraw funds from this contract to its multi-signature wallet (<em>0x7128f5ff32eD07Ce12E6a9deBE32BB40F9884b3C</em>)</li><li>the Developer DAO will then transfer those funds to unchain.fund contract at <em>0xb37b3b78022E6964fe80030C9161525880274010</em> on Polygon.</li></ul>These transactions will be transparent and visible on the Polygon blockchain.<br/><br/>Our initial plan was to transfer directly from our contract to the unchain.fund contract but there were limitations preventing this.`,
    },
    {
        question: 'What network do we use?',
        answer: 'Developer DAO for Ukraine NFTs are minted on the Polygon Network. Polygon provides lower gas fees making the NFTs more accessible and affordable.',
    },
    {
        question: 'How do I get MATIC on Polygon?',
        answer: "Check out <a href='https://github.com/Developer-DAO/pixel-avatars/wiki/Polygon-MATIC' target='_blank' rel='noopener noreferrer'>this guide</a> on the different ways you may acquire MATIC.",
    },
]
</script>
<template>
    <dl
        class="
            prose prose-sm
            max-w-none
            text-gray-500
            dark:text-gray-400
            space-y-3
            divide-y divide-gray-200
        "
    >
        <Disclosure
            v-for="faq in faqs"
            :key="faq.question"
            v-slot="{ open }"
            as="div"
            class="pt-3"
        >
            <dt class="">
                <DisclosureButton
                    class="text-left w-full flex justify-between items-center"
                >
                    <h4>
                        {{ faq.question }}
                    </h4>
                    <span class="ml-6 h-7 flex items-center text-gray-400">
                        <ChevronDownIcon
                            :class="[
                                open ? '-rotate-180' : 'rotate-0',
                                'h-6 w-6 transform transition',
                            ]"
                            aria-hidden="true"
                        />
                    </span>
                </DisclosureButton>
            </dt>
            <DisclosurePanel as="dd" class="mt-2 pr-12">
                <!-- eslint-disable-next-line vue/no-v-html -->
                <p v-html="faq.answer" />
                <!-- {{ faq.answer }} -->
                <!-- </p> -->
            </DisclosurePanel>
        </Disclosure>
    </dl>
</template>
<style>
.prose h4 {
    @apply dark:text-gray-300;
}
.prose a {
    @apply dark:text-gray-300;
}
</style>
