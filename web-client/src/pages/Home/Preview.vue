<script setup>
import { inject } from 'vue'

const state = inject('previewState')

</script>

<template>
    <div class="space-y-4">
        <img
            :src="state.selected.value.preview_src"
            class="rounded-md"
        />
    </div>
</template>
