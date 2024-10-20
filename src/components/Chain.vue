<script setup lang="ts">
    const props = defineProps<{
        width: number;
        height: number;
        id: string;
        fromX: number;
        fromY: number;
        toX: number;
        toY: number;
        class: string;
    }>();
</script>
<template>
    <svg xmlns="http://www.w3.org/2000/svg" :viewBox="`0 0 ${width} ${height}`" :id="`chain-${id}`">
    <defs>
        <line :id="`chain-path-${id}`" :x1="fromX" :x2="toX" :y1="fromY" :y2="toY" fill="none"/>

        <mask :id="`holes-${id}`">
            <!-- white everywhere = keep everything... -->
            <rect x="0%" y="0%" width="100%" height="100%" fill="white"/>

            <!-- ...except holes -->
            <use :href="`#chain-path-${id}`" class="hole-mask" stroke="black"/>
        </mask>
    </defs>

    <!-- segments whose hole is visible, with holes cut out using mask-->
    <use :href="`#chain-path-${id}`" class="hole" :class="class" :mask="`url(#holes-${id})`"/>

    <!-- segments whose hole isn't visible -->
    <use :href="`#chain-path-${id}`" :class="class"/>
</svg>
</template>

<style>
svg {
    width : 100%;
    height : 100%;
    position: absolute;

    .hole-mask {
      stroke-width: 4;
      stroke-dasharray: 6 14;
      stroke-dashoffset: 7;
    }

    .chain {
      stroke-opacity: 1;
      stroke-width: 2;
      stroke-dasharray: 12 8;
      stroke-linecap: round;

      &.normal {
        stroke: white;
      }
      &.hole {
        stroke-width: 8;
        stroke-dasharray: 6 14;
        stroke-dashoffset: 7;
      }
      &.hover {
        stroke: silver;
        filter: drop-shadow(0 0 3px yellow);
      }
      &.bomb {
        stroke: orangered;
      }
      &.correct {
        stroke: yellowgreen;
      }
    }
  } 
</style>