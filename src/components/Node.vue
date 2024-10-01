<script setup lang="ts">
    export type NodeEvent = {
        target: EventTarget;
        x: number;
        y: number;
    };

    const emit = defineEmits<{
        (e: 'hover', value: { target: EventTarget | undefined, x: number, y: number}): void
        (e: 'click', value: { target: EventTarget, x: number, y: number}): void
        (e: 'drop', value: { target: EventTarget, x: number, y: number}): void
    }>();

    const props = defineProps<{
        title: string,
        thumbnail: string,
        linkCount: number,
        style: string
    }>();

    function onClick(event: MouseEvent) {
        emit("click", { target: event.target!, x: event.clientX, y: event.clientY });
    }

    function onDrop(event: MouseEvent) {
        emit("drop", { target: event.target!, x: event.clientX, y: event.clientY });
    }

    function onMouseOut(event: MouseEvent) {
        emit("hover", { target: undefined, x: event.clientX, y: event.clientY });
    }

    function onMouseOver(event: MouseEvent) {
        emit("hover", { target: event.target!, x: event.clientX, y: event.clientY });
    }
</script>

<template>
    <div :class="['node', style]" :style="{backgroundImage: 'url(' + thumbnail + ')'}" draggable="true" @mouseover="onMouseOver" @mouseout="onMouseOut" @click="onClick" @dragend="onDrop">
        <h3 :title="title">{{ title }}</h3>
        <p :title="`Has ${linkCount} connections to other articles`">{{ linkCount }}</p>
    </div>
</template>