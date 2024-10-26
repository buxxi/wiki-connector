<script setup lang="ts">
	import GameRunning from './components/GameRunning.vue';
	import GameSetup from './components/GameSetup.vue';
	import GameOver from './components/GameOver.vue';
	import Background from './components/Background.vue';

	import { nextTick, ref } from 'vue';
	import type Game from './services/game';
	import type Result from './domain/result';
	import SettingsService from './services/settings';

	enum GameState {
		NOT_STARTED = "NOT_STARTED",
		STARTED = "STARTED",
		WON = "WON",
		LOST = "LOST"
	}

	const settings = new SettingsService();
	const gameComponent = ref<undefined | InstanceType<typeof GameRunning>>(undefined);
	const gameOverComponent = ref<undefined | InstanceType<typeof GameOver>>(undefined);
	const gameState = ref<GameState>(GameState.NOT_STARTED);
	const animate = ref<boolean>(settings.read().animate);

	async function gameStarted(game: Game, result: Result) {
		gameState.value = GameState.STARTED;
		await nextTick();
		gameComponent.value?.gameStarted(game, result);
	}

	function restartGame() {
		gameState.value = GameState.NOT_STARTED;
	}

	function animateChanged(value: boolean) {
		animate.value = value;
		settings.save({ animate: animate.value });
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
	<main :class="animate ? 'animated' : undefined">
		<Background :key="`background-${animate}`" :won="gameState == GameState.WON" :lost="gameState == GameState.LOST" />
		<GameSetup @animateChanged="animateChanged" @started="gameStarted" v-if="gameState == GameState.NOT_STARTED" />
		<GameRunning @won="gameWon" @lost="gameLost" @restart="restartGame" ref="gameComponent" v-if="gameState != GameState.NOT_STARTED" />
		<GameOver @restart="restartGame" ref="gameOverComponent" v-if="gameState == GameState.WON || gameState == GameState.LOST" />
	</main>
</template>
