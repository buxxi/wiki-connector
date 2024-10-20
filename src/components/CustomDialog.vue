<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
    title: string;
    closeable?: boolean;
}>();

let open = ref<boolean>(true);

function closeModal() {
    open.value = false;
}

</script>

<template>
  <dialog :open="open">
    <a @click="closeModal" v-if="closeable" class="close">✕</a>
    <h1>{{ title }}</h1>
    <form>
      <div>
        <slot name="content"></slot>
      </div>
      <div class="buttons">
        <slot name="buttons"></slot>
      </div>
    </form>
  </dialog>
</template>

<style>
@keyframes falling-bounce {
  0% {
    top: -1000em;
  }
  50% {
    top: 0em;
  }
  70% {
    top: -10em;
  }
  100% {
    top: 0;
  }
}

dialog {
  animation: 1s normal 1 falling-bounce;
  position: fixed;
  z-index: 2;
  top: 0;
  bottom: 0;
  left: 0;
  right : 0;
  border-radius: 1em;
  border: 3px solid gray;
  box-shadow: 0 0 20px black;
  overflow: hidden;
  h1 {
    margin: 0;
    border-bottom : 1px solid gray;
    text-align: center;
    font-size: 4em;
  }
  h2 {
    border-bottom: 1px dashed gray;
  }
  .close {
    position: absolute;
    right : 0;
    border: 1px solid rgb(7, 49, 104);
    background-color: rgb(12, 95, 204);
    color: white;
    font-weight: bold;
    cursor: pointer;
    width : 2em;
    height : 2em;
    line-height: 2em;
    margin-top: -1em;
    text-align: center;
    border-bottom-left-radius: 1em;
    &:hover {
      background-color: rgb(12, 143, 204);
    }
  }
  .buttons {
    display : flex;
    justify-content: space-around;
  }
}
</style>