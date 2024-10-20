<script setup lang="ts">
	import type Result from '@/domain/result.ts';
	import CustomDialog from './CustomDialog.vue';
	import Game, { GameMode, type Language } from '../services/game.ts';
	import { Difficulty, getDifficultySetting } from '@/domain/difficulty.ts';
	import { useI18n } from 'vue-i18n';
	import { onMounted } from 'vue';


	const emit = defineEmits<{
		(e: 'started', game: Game, result: Result): void
	}>();

	const language = defineModel<string>('language', { default: 'en' });
	const type = defineModel<string>('type', { default: 'curated' });
	const difficulty = defineModel<number>('difficulty', { default: 2 });
	const i18n = useI18n();

	function languageChanged() {
		i18n.locale.value = language.value;
	}

	onMounted(() => {
		language.value = i18n.locale.value;
	});

	async function startGame() {
		let gameMode = type.value as GameMode;
		let selectedDifficulty = difficulty.value as Difficulty;

		let game = new Game(language.value as Language, selectedDifficulty, gameMode);

		let result = await game.start();
		emit('started', game, result);
	}
</script>


<template>
	<CustomDialog :title="$t('title')">
		<template v-slot:content>
			<section class="settings">
				<h2>{{ $t('settings') }}</h2>
				<fieldset>
					<label for="language-en">{{ $t('language.select') }}</label>

					<input type="radio" v-model="language" id="language-en" value="en" @change="languageChanged">
					<label for="language-en"><i>🇺🇸</i> {{ $t('language.en') }}</label>
					<input type="radio" v-model="language" id="language-sv" value="sv" @change="languageChanged">
					<label for="language-sv"><i>🇸🇪</i> {{ $t('language.sv') }}</label>
				</fieldset>
				<fieldset>
					<label for="type">{{ $t('gameMode.select') }}</label>
					<select id="type" v-model="type">
						<option value="curated">{{ $t('gameMode.curated') }}</option>
						<option value="random">{{ $t('gameMode.random') }}</option>
						<option value="popular">{{ $t('gameMode.popular') }}</option>
					</select>
				</fieldset>
				<fieldset>
					<label for="difficulty">{{ $t('difficulty.title') }}</label>
					<input id="difficulty" type="range" list="difficulties" min="0" max="4"
						v-model.number="difficulty" />
					<span class="difficulty-smiley"><i>{{ getDifficultySetting(difficulty).smiley }}</i></span> <span>{{
						$t('difficulty.' + difficulty) }}</span>

					<datalist id="difficulties">
						<option
							v-for="([value, key], idx) in Object.entries(Difficulty).filter(([_, k]) => Number.isInteger(k))"
							:value="key">{{ value }}</option>
					</datalist>
				</fieldset>
			</section>
			<section class="rules">
				<h2>{{ $t('instructions.title') }}</h2>
				<div>
					<img src="@/assets/rules-example.png" />
					<i18n-t keypath="instructions.text" tag="p" scope="global">
						<template v-slot:articles><b>{{ getDifficultySetting(difficulty).articles }}</b></template>
						<template v-slot:bombs><b>{{ getDifficultySetting(difficulty).bombs }}</b></template>
					</i18n-t>
				</div>
			</section>
		</template>
		<template v-slot:buttons>
			<input type="button" :value="$t('button.start')" @click.prevent="startGame" />
		</template>
	</CustomDialog>
</template>

<style>
	.settings {
		fieldset {
			padding: 0.5em 0.25em;
			border: 0;
			display: flex;
			align-items: center;

			label {
				font-weight: bold;
				width: 8em;
			}

			.difficulty-smiley {
				font-size: 2em;
				line-height: 0.5em;
				padding: 0 0.25em;
			}

			input~label {
				font-weight: normal;
			}
		}
	}

	.rules {
		div {
			display: flex;
			flex-direction: row-reverse;
			align-items: center;
			padding: 0.5em;
			margin-bottom: 1em;
		}

		img {
			width: 250px;
			height: 100px;
		}

		p {
			white-space: pre;
			font-size: 0.85em;
			font-style: italic;
		}
	}
</style>
