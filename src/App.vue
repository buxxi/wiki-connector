<script setup lang="ts">
	import GameRunning from './components/GameRunning.vue';
	import GameSetup from './components/GameSetup.vue';
	import GameOver from './components/GameOver.vue';
	import Background from './components/Background.vue';

	import { nextTick, reactive, ref } from 'vue';
	import type Game from './services/game';
	import type Result from './domain/result';

	enum GameState {
		NOT_STARTED = "NOT_STARTED",
		STARTED = "STARTED",
		WON = "WON",
		LOST = "LOST"
	}

	const gameComponent = ref<undefined | InstanceType<typeof GameRunning>>(undefined);
	const gameOverComponent = ref<undefined | InstanceType<typeof GameOver>>(undefined);
	const gameState = reactive({ value: GameState.NOT_STARTED });

	async function gameStarted(game: Game, result: Result) {
		gameState.value = GameState.STARTED;
		await nextTick();
		gameComponent.value?.gameStarted(game, result);
	}

	function restartGame() {
		gameState.value = GameState.NOT_STARTED;
	}

	async function gameWon(game: Game, result: Result) {
		gameState.value = GameState.WON;
		await nextTick();
		gameOverComponent.value?.gameWon(game, result);
	}

	async function gameLost(game: Game, result: Result) {
		gameState.value = GameState.LOST;
		await nextTick();
		gameOverComponent.value?.gameLost(game, result);
	}
</script>

<template>
	<main>
		<Background />
		<GameSetup @started="gameStarted" v-if="gameState.value == 'NOT_STARTED'" />
		<GameRunning @won="gameWon" @lost="gameLost" @restart="restartGame" ref="gameComponent"
			v-if="gameState.value != 'NOT_STARTED'" />
		<GameOver @restart="restartGame" ref="gameOverComponent"
			v-if="gameState.value == GameState.WON || gameState.value == GameState.LOST" />
	</main>
</template>
