<script setup lang="ts">
import TimeFormat from './TimeFormat.vue';
import CustomDialog from './CustomDialog.vue';
import History from './History.vue';
import { ArticleState } from '@/domain/article';
import { Difficulty } from '@/domain/difficulty';
import type Result from '@/domain/result';
import type Game from '@/services/game';
import HistoryService from '@/services/history';
import { ref } from 'vue';
  const emit = defineEmits<{
    (e: 'restart'): void,  
  }>();

  defineExpose({
    gameWon: gameWon,
    gameLost: gameLost
  });

  let history = new HistoryService();
  let open = ref<boolean>(true);
  let won = ref<boolean>(false);
  let titles = ref<string[]>([]);
  let currentResult = ref<HistoryResult | undefined>(undefined);
  let allResults = ref<HistoryResult[]>([]);

  function gameWon(game: Game, result: Result) {
    won.value = true;
    titles.value.splice(0, titles.value.length);
    for (let title of result.titles(ArticleState.START)) {
      titles.value.push(title);
    }

    currentResult.value = new HistoryResult(result.started!, true, game.difficulty, result.seconds(), result.titles(ArticleState.BOMB).length, result.shortest());
    history.add(currentResult.value);
    allResults.value = history.read().reverse();
  }

  function gameLost(game: Game, result: Result) {
    won.value = false;

    titles.value.splice(0, titles.value.length);
    let startNode = result.found.find(art => art.state == ArticleState.START && art.links.find(link => link.state == ArticleState.BOMB) != undefined)!;
    titles.value.push(startNode!.title);

    currentResult.value = new HistoryResult(result.started!, false, game.difficulty, result.seconds(), result.titles(ArticleState.BOMB).length, undefined);
    history.add(currentResult.value);
    allResults.value = history.read().reverse();
  }

  function newGame() {
    emit('restart');
  }

  class HistoryResult {
    date: Date;
    won: boolean;
    difficulty: Difficulty;
    seconds: number;
    bombs: number;
    shortest: number | undefined;

    constructor(date: Date, won: boolean, difficulty: Difficulty, seconds: number, bombs: number, shortest: number | undefined) {
      this.date = date;
      this.won = won;
      this.difficulty = difficulty;
      this.seconds = seconds;
      this.bombs = bombs;
      this.shortest = shortest;
    }
  }
</script>

<template>
 <CustomDialog :title="won ? $t('results.won.title') : $t('results.lost.title')">
  <template v-slot:content>
      <section class="results">
        <h2>{{ $t('results.title') }}</h2>
        <p v-if="!won">
          <i18n-t keypath="results.lost.connected" tag="span" scope="global">
            <template v-slot:firstTitle>
              <b>{{ titles[0] }}</b>
            </template>
          </i18n-t>
        </p>
        <p v-if="won">
          <i18n-t keypath="results.won.connected" tag="span" scope="global">
            <template v-slot:firstTitle>
              <b>{{ titles[0] }}</b>
            </template>
            <template v-slot:otherTitles>
              <span v-for="(title, index) in titles.slice(1)">
                <b>{{ title }}</b>
                <span v-if="index == titles.length - 3"> {{ $t('and') }} </span>
                <span v-else-if="index < titles.length - 2">, </span>
              </span>
            </template>
          </i18n-t>
          <br/>
          <i18n-t keypath="results.won.stats" tag="span" scope="global">
            <template v-slot:steps>
              <b>{{ currentResult!.shortest }}</b>
            </template>
            <template v-slot:time>
              <b><TimeFormat :seconds="currentResult!.seconds"></TimeFormat></b>
            </template>
          </i18n-t>
        </p>
      </section>

      <section class="history">
        <h2>{{ $t('history.title') }}</h2>
        <div>
          <History :entries="allResults"></History>
        </div>
      </section>
    </template>
    <template v-slot:buttons>
        <input type="button" :value="$t('button.new')" @click="newGame"/>
    </template>
  </CustomDialog>
</template>

<style>
.history {
  div {
    display : block;
    overflow: auto;
    max-height: 10em;
    margin-bottom: 2em;
    background: #eee;
  }
}
</style>

