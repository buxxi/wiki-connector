<script setup lang="ts">
	import type Result from '@/domain/result';
	import Graph from './Graph.vue';
	import GuessInput from './GuessInput.vue';
	import Info from './Info.vue';
	import { ref } from 'vue';
	import type Game from '@/services/game';
	import type Article from '@/domain/article';
	import { ResultType } from '@/domain/result';
	import { ArticleState } from '@/domain/article';
	import type { Duration } from '@/domain/duration';

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

	const seconds = ref<number>(0);
	const timer = ref();

	function gameStarted(newGame: Game, newResult: Result) {
		game.value = newGame;
		game.value.onTimeChange(durationChanged);
		game.value.onResultChange(resultChanged);
		convertResult(newResult);
	}

	async function guessed(value: string) {
		try {
			suggestions.value.splice(0, suggestions.value.length);
			await game.value!.guess(value);
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

	function durationChanged(duration: Duration) {
		seconds.value = duration.seconds();
	}

	function resultChanged(result: Result) {
		switch (result.type) {
			case ResultType.WON:
				emit("won", game.value!, result);
				break;
			case ResultType.LOST:
				emit("lost", game.value!, result);
				break;
		}
		convertResult(result);
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

		counts.value.start = result.titles(ArticleState.START).length;
		counts.value.bombs = result.titles(ArticleState.BOMB).length;
		counts.value.found = result.titles(ArticleState.FOUND).length;
		counts.value.links = result.linkCount();
	}

</script>

<template>
	<div>
		<Graph :nodes="nodes" v-if="nodes.length > 0" />
		<GuessInput :suggestions="suggestions" @guess="guessed" @type="typed" ref="input" />
		<Info :start="counts.start" :found="counts.found" :possibleLinks="counts.links" :bombs="counts.bombs"
			:time="seconds" @restart="emit('restart')" />
	</div>
</template>
