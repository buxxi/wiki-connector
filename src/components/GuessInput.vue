<script setup lang="ts">
	import { computed, reactive, ref, watch } from 'vue';

	const props = defineProps<{
		suggestions: string[]
	}>();
	const emit = defineEmits<{
		(e: 'type', value: string): void
		(e: 'guess', value: string): void
	}>();
	defineExpose({
		clear: clearGuess,
		invalidInput: shake
	});
	const guess = defineModel<string>('guess');
	const index = reactive({ value: 0 });
	const classes = ref<string[]>(['user-guess']);

	const autocomplete = computed(() => {
		const suggestions = props.suggestions;
		if (!guess.value || suggestions.length == 0) {
			return "";
		}
		if (suggestions[index.value].startsWith(guess.value)) {
			return `${suggestions[index.value]} (${index.value + 1}/${suggestions.length})`;
		} else {
			return `${guess.value} → ${suggestions[index.value]} (${index.value + 1}/${suggestions.length})`;
		}
	});

	watch(props.suggestions, () => {
		index.value = 0;
	});

	function clearGuess() {
		guess.value = "";
	}

	function shake() {
		classes.value.push('shake');
	}

	function shakeEnd() {
		let i = classes.value.indexOf('shake');
		classes.value.splice(i);
	}

	function performAutocomplete() {
		const suggestions = props.suggestions;
		if (suggestions.length > 0) {
			guess.value = suggestions[index.value];
		}
	}

	function previousAutocomplete() {
		const suggestions = props.suggestions;
		index.value = (suggestions.length + index.value - 1) % suggestions.length;
	}

	function nextAutocomplete() {
		const suggestions = props.suggestions;
		index.value = (index.value + 1) % suggestions.length;
	}

	function makeGuess() {
		if (guess.value != undefined && guess.value.trim().length > 0) {
			emit('guess', guess.value);
		}
	}

	async function emitChange(event: KeyboardEvent) {
		if (guess.value != undefined && !['tab', 'arrowdown', 'arrowup', 'enter'].includes(event.key.toLowerCase())) {
			emit('type', guess.value);
		}
	}

</script>

<template>
	<div id="guess">
		<dl id="keylegend" v-if:="!!autocomplete">
			<dt>{{ $t('keylegend.enter.name') }}</dt>
			<dd>{{ $t('keylegend.enter.value') }}</dd>
			<dt>{{ $t('keylegend.tab.name') }}</dt>
			<dd>{{ $t('keylegend.tab.value') }}</dd>
			<dt>{{ $t('keylegend.up.name') }}</dt>
			<dd>{{ $t('keylegend.up.value') }}</dd>
			<dt>{{ $t('keylegend.down.name') }}</dt>
			<dd>{{ $t('keylegend.down.value') }}</dd>
		</dl>
		<form>
			<input type="text" :class="classes" v-model="guess" @keydown.tab.prevent="performAutocomplete"
				@keyup.up.prevent="previousAutocomplete" @keyup.down.prevent="nextAutocomplete"
				@keyup.enter.prevent="makeGuess" @keyup="emitChange" @animationend="shakeEnd"
				:placeholder="$t('guess.placeholder')" autofocus="true" />
			<input type="text" class="autocomplete" :value="autocomplete" disabled />
		</form>
	</div>
</template>

<style>
	@keyframes shake {
		from {
			padding-left: -1em;
		}

		to {
			padding-left: 1em;
		}
	}

	#guess {
		position: fixed;
		bottom: 5em;
		height: 5em;
		left: 0;
		right: 0;
		z-index: 3;

		input {
			border: 0;
			width: 100%;
			font-size: 3em;
			padding: 0.25em 0.5em;
			font-weight: 700;
			position: absolute;

			&:focus {
				outline: none;
			}

			&.user-guess {
				z-index: 2;
				background-color: transparent;
				color: var(--guess-text-color);

				&.shake {
					animation: 0.1s ease normal 5 shake;
				}

				&::placeholder {
					color: var(--guess-text-placeholder-color);
				}
			}

			&.autocomplete {
				z-index: 1;
				background-color: var(--guess-bg-color);
				color: var(--guess-text-placeholder-color);
			}
		}

		#keylegend {
			user-select: none;
			position: absolute;
			z-index: 3;
			right: 0;
			margin-top: 0.5em;

			dt {
				font-weight: bold;
				min-width: 1.25em;
				text-align: center;
				background-color: var(--keylegend-bg-color);
				padding: 0.1em 0.25em;
				border: 4px inset var(--keylegend-border-color);
				border-radius: 0.25em;
			}

			dd {
				font-weight: normal;
			}
		}
	}

</style>