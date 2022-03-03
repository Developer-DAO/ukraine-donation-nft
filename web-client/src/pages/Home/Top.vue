<script setup>
import DaoLogo from "../../components/ui/DaoLogo";
import Address from "../../components/ui/Address";
import {inject} from "vue";

const client = inject('web3client')
</script>
<template>
    <div class="px-4 pt-8 sm:pt-12 sm:px-6 mx-auto lg:max-w-7xl lg:px-8 flex justify-between items-center text-gray-800 dark:text-gray-200">
        <span class="flex items-center">
            <DaoLogo class="w-16 h-16 rounded-full shadow-md" />
            <span class="ml-4 font-semibold hidden sm:inline text-gray-900 dark:text-gray-100">Developer DAO</span>
        </span>
        <div v-if="client.isConnected.value" class="flex-1 min-w-0 flex flex-col items-end space-y-1">
            <span class="text-sm text-gray-500 dark:text-gray-400">Connected to</span>
            <div>
                <Address
                    v-model="client.connectedAddress.value"
                    class="text-sm font-semibold truncate"
                />
            </div>
            <button
                class="text-sm inline text-blue-600 dark:text-blue-400"
                @click="client.disconnect()"
            >
                Disconnect
            </button>
        </div>
    </div>
</template>