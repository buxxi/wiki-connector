<script setup lang="ts">
  import GameRunning from './components/GameRunning.vue';
  import GameSetup from './components/GameSetup.vue';
  import GameWon from './components/GameWon.vue';
  import GameLost from './components/GameLost.vue';

  import { nextTick, reactive, ref } from 'vue';
  import type Game from './services/game';
  import type Result from './domain/result';

  enum GameState {
    NOT_STARTED = "NOT_STARTED",
    STARTED = "STARTED",
    WON =  "WON",
    LOST = "LOST"
  }

  const gameComponent = ref<undefined | InstanceType<typeof GameRunning>>(undefined);
  const gameState = reactive({ value : GameState.NOT_STARTED});

  async function gameStarted(game: Game, result: Result) {
    gameState.value = GameState.STARTED;
    await nextTick();
    gameComponent.value?.gameStarted(game, result);
  }

  async function gameWon(game: Game, result: Result) {
    gameState.value = GameState.WON;
  }

  async function gameLost(game: Game, result: Result) {
    gameState.value = GameState.LOST;
  }
</script>

<template>
  <main>
    <GameSetup @started="gameStarted" v-if="gameState.value == 'NOT_STARTED'"/>
    <GameRunning @won="gameWon" @lost="gameLost" ref="gameComponent" v-if="gameState.value != 'NOT_STARTED'"/>
    <GameWon v-if="gameState.value == GameState.WON"/>
    <GameLost v-if="gameState.value == GameState.LOST"/>
  </main>
</template>

