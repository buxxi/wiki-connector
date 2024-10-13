<script setup lang="ts">
    const props = defineProps<{
        seconds: number
    }>();

    function formatTime(seconds: number) : string {
        let minutes = Math.floor(seconds / 60);
        seconds = seconds - (minutes * 60);
        return minutes.toString().padStart(2, '0') + ":" + seconds.toString().padStart(2, '0');
    }
</script>

<template>
    <span>{{  formatTime(seconds) }}</span>
</template>