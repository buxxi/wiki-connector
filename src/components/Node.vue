<script setup lang="ts">
    const props = defineProps<{
        title: string,
        thumbnail: string,
        linkCount: number,
        style: string
    }>();

    //TODO: emit click and hover
</script>

<template>
    <div :class="['node', style]" :style="{backgroundImage: 'url(' + thumbnail + ')'}">
        <h3 :title="title">{{ title }}</h3>
        <p :title="`Has ${linkCount} connections to other articles`">{{ linkCount }}</p>
    </div>
</template>