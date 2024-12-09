<script setup lang="ts">
	import type Result from '@/domain/result.ts';
	import CustomDialog from './CustomDialog.vue';
	import Game, { GameMode, type Language } from '../services/game.ts';
	import { Difficulty, getDifficultySetting } from '@/domain/difficulty.ts';
	import { useI18n } from 'vue-i18n';
	import { onMounted } from 'vue';
	import SettingsService from '@/services/settings.ts';

	const settings = new SettingsService();
	const emit = defineEmits<{
		(e: 'started', game: Game, result: Result): void
		(e: 'animateChanged', value: boolean): void
	}>();

	const language = defineModel<string>('language', { default: 'en' });
	const type = defineModel<string>('type', { default: 'curated' });
	const difficulty = defineModel<number>('difficulty', { default: 2 });
	const animate = defineModel<boolean>('animate', { default: false });
	const i18n = useI18n();

	function languageChanged() {
		i18n.locale.value = language.value;
	}

	onMounted(() => {
		language.value = i18n.locale.value;
		animate.value = settings.read().animate;
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
	<CustomDialog :title="$t('title')" :locked="true">
		<template v-slot:content>
			<section class="settings">
				<i18n-t keypath="disclaimer.text" tag="span" scope="global" class="disclaimer">
					<template v-slot:creator>BuXXi</template>
					<template v-slot:url><a href="https://github.com/buxxi/wiki-connector">GitHub</a></template>
				</i18n-t>
				<h2>{{ $t('settings') }}</h2>
				<fieldset>
					<label for="language-en">{{ $t('language.select') }}</label>

					<div>
						<input type="radio" v-model="language" id="language-en" value="en" @change="languageChanged">
						<label for="language-en"><i>🇺🇸</i> {{ $t('language.en') }}</label>
						<input type="radio" v-model="language" id="language-sv" value="sv" @change="languageChanged">
						<label for="language-sv"><i>🇸🇪</i> {{ $t('language.sv') }}</label>
					</div>
				</fieldset>
				<fieldset>
					<label for="type">{{ $t('gameMode.select') }}</label>
					<div class="select-wrapper">
						<select id="type" v-model="type">
							<option value="curated">{{ $t('gameMode.curated') }}</option>
							<option value="random">{{ $t('gameMode.random') }}</option>
							<option value="popular">{{ $t('gameMode.popular') }}</option>
						</select>
					</div>
				</fieldset>
				<fieldset>
					<label for="difficulty">{{ $t('difficulty.title') }}</label>
					<div>
						<input id="difficulty" type="range" list="difficulties" min="0" max="4" v-model.number="difficulty" />
						<span class="difficulty-smiley"><i>{{ getDifficultySetting(difficulty).smiley }}</i></span> <span>{{
							$t('difficulty.' + difficulty) }}</span>

						<datalist id="difficulties">
							<option v-for="([value, key], idx) in Object.entries(Difficulty).filter(([_, k]) => Number.isInteger(k))" :value="key">{{ value }}</option>
						</datalist>
					</div>
				</fieldset>
				<fieldset>
					<label for="animate">{{ $t('animate.title') }}</label>
					<input id="animate" type="checkbox" v-model="animate" @change="emit('animateChanged', animate)" />
					<label for="animate"></label>
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
	.disclaimer {
		color: var(--button-disable-color);
		text-align: center;
		display: block;
		font-size: 0.8em;

		a {
			color: var(--button-bg-color);
		}
	}

	.settings {
		.difficulty-smiley {
			font-size: 2em;
			line-height: 0.5em;
			padding: 0 0.25em;
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

	@media (max-width: 650px) {
		.settings {
			fieldset {
				display: block;
			}

			label:nth-child(1) {
				font-weight: bold;
				width: 8em;
			}
		}

		.rules div {
			flex-direction: column-reverse;
		}
	}
</style>
