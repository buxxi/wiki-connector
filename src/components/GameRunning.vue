<script setup lang="ts">
import type Result from '@/domain/result';
import Graph from './Graph.vue';
import GuessInput from './GuessInput.vue';
import Info from './Info.vue';
import { ref, computed } from 'vue';
import type Game from '@/services/game';
import type Article from '@/domain/article';
import { ResultType } from '@/domain/result';

const emit = defineEmits<{
  (e: 'won', game: Game, result: Result): void,
  (e: 'lost', game: Game, result: Result): void
}>();

defineExpose({
  gameStarted: gameStarted
});

const game = ref<undefined | Game>(undefined);
const nodes = ref<Article[]>([]);
const suggestions = ref<string[]>([]);
const input = ref<undefined | InstanceType<typeof GuessInput>>(undefined);
const linkCount = computed(() => {
  return nodes.value.map(n => n.linkCount).reduce((a, b) => a + b, 0);
});


function gameStarted(newGame: Game, newResult: Result) {
  game.value = newGame;
  convertResult(newResult);
}

async function guessed(value: string) {
  try {
    let newResult = await game.value!.guess(value);
    convertResult(newResult);
    switch(newResult.type) {
      case ResultType.WON:
        emit("won", game.value!, newResult);
        break;
      case ResultType.LOST:
        emit("lost", game.value!, newResult);
        break;
      case ResultType.ONGOING:
        input.value?.clear();
    }
  } catch (e) {
    input.value?.invalidInput();
  }
}

function typed(value: string) {
  let values = game.value?.autoCompleteSuggestions(value) || [];
  suggestions.value.splice(0, suggestions.value.length);
  suggestions.value.push(...values);
}

function convertResult(result: Result) {
  for (let article of result.found) {
    let i = nodes.value.map(e => e.id()).indexOf(article.id());
    if (i == -1) {
      nodes.value.push(article);
    } else {
      nodes.value[i] = article;
    }
  }
}

</script>

<template>
  <div>
    <Graph :nodes="nodes"/>
    <GuessInput :suggestions="suggestions" @guess="guessed" @type="typed" ref="input"/>
    <Info :found="nodes.length" :possible="linkCount"/>
  </div>
</template>
