<script setup lang="ts">
import type Result from '@/domain/result';
import Graph from './Graph.vue';
import GuessInput from './GuessInput.vue';
import Info from './Info.vue';
import { ref, computed } from 'vue';
import type Game from '@/services/game';
import type Article from '@/domain/article';
import { ResultType } from '@/domain/result';
import { ArticleState } from '@/domain/article';

const emit = defineEmits<{
  (e: 'won', game: Game, result: Result): void,
  (e: 'lost', game: Game, result: Result): void,
  (e: 'restart'): void,  
}>();

defineExpose({
  gameStarted: gameStarted
});

const game = ref<undefined | Game>(undefined);
const nodes = ref<Article[]>([]);
const suggestions = ref<string[]>([]);
const input = ref<undefined | InstanceType<typeof GuessInput>>(undefined);
const counts = ref({
  links: 0,
  start: 0,
  bombs: 0,
  found: 0
});

const started = ref<Date | undefined>();
const ended = ref<Date | undefined>();
const seconds = ref<number>(0);
const timer = ref();

function gameStarted(newGame: Game, newResult: Result) {
  started.value = newResult.started;
  game.value = newGame;
  convertResult(newResult);
}

async function guessed(value: string) {
  try {
    suggestions.value.splice(0, suggestions.value.length);

    let newResult = await game.value!.guess(value);
    convertResult(newResult);
    switch(newResult.type) {
      case ResultType.WON:
        ended.value = newResult.ended;
        clearInterval(timer.value);
        emit("won", game.value!, newResult);
        break;
      case ResultType.LOST:
        ended.value = newResult.ended;
        clearInterval(timer.value);
        emit("lost", game.value!, newResult);
        break;
    }
    input.value?.clear();
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
  clearInterval(timer.value);

  for (let article of result.found) {
    let i = nodes.value.map(e => e.id()).indexOf(article.id());
    if (i == -1) {
      nodes.value.push(article);
    } else {
      nodes.value[i] = article;
    }
  }
  
  counts.value.start = result.titles(ArticleState.START).length;
  counts.value.bombs = result.titles(ArticleState.BOMB).length;
  counts.value.found = result.titles(ArticleState.FOUND).length;
  counts.value.links = result.linkCount();

  timer.value = setInterval(() => {
    seconds.value = result.seconds();
  }, 1000);
}

</script>

<template>
  <div>
    <Graph :nodes="nodes"/>
    <GuessInput :suggestions="suggestions" @guess="guessed" @type="typed" ref="input"/>
    <Info :start="counts.start" :found="counts.found" :possibleLinks="counts.links" :bombs="counts.bombs" :time="seconds" @restart="emit('restart')"/>
  </div>
</template>
