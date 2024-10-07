<script setup lang="ts">
import { onMounted } from "vue";

const lineWidth = 100;
const lineHeight = 15;

function rerender() {
    let bg = document.querySelector("#background")! as HTMLCanvasElement;
    bg.width = window.innerWidth;
    bg.height = window.innerHeight;
    let context = bg.getContext("2d")!;
    for (var y = 0; y < bg.height; y = y + lineHeight) {
        let offset = y % (lineHeight * 2) == 0 ? -(lineWidth / 2) : 0;
        for (var x = 0; x < bg.width; x = x + lineWidth) {
            let h = Math.floor(x + (y * Math.random()) % 360);
            let s = 10;
            let v = 20;
            context.fillStyle = `hsl(${h}, 0%, 10%)`;
            context.fillRect(x + offset, y, lineWidth, lineHeight);
            context.fillStyle = `hsl(${h}, ${s}%, ${v}%)`;
            context.fillRect(x + offset + 1, y + 1, lineWidth - 1, lineHeight - 2);
        }
    }
}

onMounted(() => {
    rerender();
    window.addEventListener("resize", rerender);
});


</script>

<template>
    <canvas id="background"></canvas>
</template>
