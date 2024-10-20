<script setup lang="ts">
    export type NodeEvent = {
        target: EventTarget | undefined;
        x: number;
        y: number;
    };
    type Position = {
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
        style: string,
        position: Position
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
    <div :class="['node', style]" :style="{backgroundImage: 'url(' + thumbnail + ')', left: `${position.x}px`, top: `${position.y}px`}" draggable="true" @mouseover="onMouseOver" @mouseout="onMouseOut" @click="onClick" @dragend="onDrop">
        <h3 :title="title">{{ title }}</h3>
        <p :title="$t('article.connections', {linkCount: linkCount})">{{ linkCount }}</p>
    </div>
</template>

<style>
@keyframes zoom {
  from {
    transform: scale(10);
  } 
  to {
    transform: scale(1);
  }
}

.node {
  position: absolute;
  background: white;
  width : 8em;
  height : 8em;
  margin-left: -4em;
  margin-top : -4em;
  border: 3px solid white;
  border-radius: 10em;
  text-align: center;
  overflow: hidden;
  background-size: cover;
  background-position: center center;
  box-shadow: 1px 1px 10px black, inset 1px 1px 10px black;
  animation: 0.5s ease normal zoom;
  
  &.start {
    border-color: yellowgreen;
    box-shadow : 1px 1px 10px darkgreen, inset 1px 1px 10px black;
    h3 {
      border-color : yellowgreen;
    }
    p {
      border-color : yellowgreen;
    }
  }

  &.bomb {
    border-color : orangered;
    box-shadow: 1px 1px 10px darkred, inset 1px 1px 10px black;
    h3 {
      border-color : orangered;
    }
    p {
      border-color: orangered;
    }
  }


  h3 {
    font-size: 1em;
    margin-top : 5em;
    margin-bottom : 0;
    padding : 0;
    border-top: 3px solid white;
    border-bottom: 3px solid white;
    background-color: rgba(255, 255, 255, 0.75);
    text-wrap: nowrap;
    overflow: hidden;
    box-shadow: 1px 1px 10px black;
  }
  p {
    opacity: 0;
    border-bottom: 3px solid white;
    margin: 0;
    background-color: rgba(255, 255, 255, 0.9);
    &:before {
      filter: brightness(0);
      content: "🔗 ";
    }
  }
  &:hover {
    p {
      opacity : 1;
    }
    h3 {
      background-color: rgba(255, 255, 255, 0.9);
      border-bottom-width: 1px;    
    }
  }
}
</style>