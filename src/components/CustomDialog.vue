<script setup lang="ts">
	import { ref } from 'vue';

	const props = defineProps<{
		title: string;
		closeable?: boolean;
	}>();

	let open = ref<boolean>(true);

	function closeModal() {
		open.value = false;
	}

</script>

<template>
	<dialog :open="open">
		<a @click="closeModal" v-if="closeable" class="close">✕</a>
		<h1><i>{{ title }}</i></h1>
		<form>
			<div>
				<slot name="content"></slot>
			</div>
			<div class="buttons">
				<slot name="buttons"></slot>
			</div>
		</form>
	</dialog>
</template>

<style>
	@keyframes falling-bounce {
		0% {
			top: -1000em;
		}

		50% {
			top: 0em;
		}

		70% {
			top: -10em;
		}

		100% {
			top: 0;
		}
	}

	dialog {
		animation: 1s normal 1 falling-bounce;
		position: fixed;
		z-index: 2;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		border-radius: 1em;
		border: 3px solid var(--dialog-border-color);
		box-shadow: 0 0 var(--dialog-shadow-strength) var(--dialog-shadow-color);
		overflow: hidden;

		h1 {
			margin: 0;
			border-bottom: 1px solid var(--title-underline-color);
			text-align: center;
			font-size: 4em;
		}

		h2 {
			border-bottom: 1px dashed var(--title-underline-color);
		}

		.close {
			position: absolute;
			right: 0;
			border: 1px solid var(--button-border-color);
			background-color: var(--button-bg-color);
			color: var(--button-text-color);
			font-weight: bold;
			cursor: pointer;
			width: 2em;
			height: 2em;
			line-height: 2em;
			margin-top: -1em;
			text-align: center;
			border-bottom-left-radius: 1em;

			&:hover {
				background-color: var(--button-hover-color);
			}
		}

		.buttons {
			display: flex;
			justify-content: space-around;
		}
	}
</style>