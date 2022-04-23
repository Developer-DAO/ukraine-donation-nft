<script setup>
import Preview from './Preview'
import Faq from './Faq'
import { inject, provide, ref } from 'vue'
import Top from './Top'
import ProductDetails from './ProductDetails'
import usePreviewState from './usePreviewState'
import useRouteParameterSync from './useRouteParameterSync'
const client = inject('web3client')
import CountdownBanner from '../../components/CountdownBanner'

const previewState = usePreviewState()

useRouteParameterSync(previewState)

provide('previewState', previewState)
</script>
<template>
    <div class="bg-white dark:bg-gray-900">
        <!-- <CountdownBanner /> -->

        <Top />

        <div
            class="
                mx-auto
                pt-8
                pb-16
                px-4
                sm:pt-12 sm:pb-24 sm:px-6
                lg:max-w-7xl lg:px-8
            "
        >
            <!-- Product -->
            <div
                class="
                    lg:grid lg:grid-rows-1 lg:grid-cols-7 lg:gap-x-8 lg:gap-y-10
                    xl:gap-x-16
                "
            >
                <!-- Product image -->
                <div class="lg:row-end-1 lg:col-span-3">
                    <div
                        class="
                            max-w-md
                            md:max-w-lg
                            mx-auto
                            rounded-lg
                            bg-gray-100
                            overflow-hidden
                        "
                    >
                        <Preview />
                    </div>
                </div>

                <!-- Product details -->
                <!-- <ProductDetails /> -->

                <div
                    class="
                        w-full
                        max-w-2xl
                        mx-auto
                        mt-16
                        lg:max-w-none lg:mt-0 lg:col-span-3
                    "
                >
                    <h3 class="text-gray-800 dark:text-gray-200">FAQ</h3>

                    <div class="mt-5 border-b border-gray-200" />

                    <Faq />
                </div>
            </div>
        </div>
    </div>
</template>
