<script setup lang="ts">
	export type NodeEvent = {
		target: EventTarget | undefined;
		x: number;
		y: number;
	};
	type Position = {
		x: number;
		y: number;
	};

	const emit = defineEmits<{
		(e: 'hover', value: { target: EventTarget | undefined, x: number, y: number }): void
		(e: 'click', value: { target: EventTarget, x: number, y: number }): void
		(e: 'drop', value: { target: EventTarget, x: number, y: number }): void
	}>();

	const props = defineProps<{
		title: string,
		thumbnail: string,
		linkCount: number,
		style: string,
		position: Position
	}>();

	function onClick(event: MouseEvent) {
		emit("click", { target: event.target!, x: event.clientX, y: event.clientY });
	}

	function onDrop(event: MouseEvent) {
		emit("drop", { target: event.target!, x: event.clientX, y: event.clientY });
	}

	function onMouseOut(event: MouseEvent) {
		emit("hover", { target: undefined, x: event.clientX, y: event.clientY });
	}

	function onMouseOver(event: MouseEvent) {
		emit("hover", { target: event.target!, x: event.clientX, y: event.clientY });
	}
</script>

<template>
	<div :class="['node', style]"
		:style="{ backgroundImage: 'url(' + thumbnail + ')', left: `${position.x}px`, top: `${position.y}px` }"
		draggable="true" @mouseover="onMouseOver" @mouseout="onMouseOut" @click="onClick" @dragend="onDrop">
		<h3 :title="title">{{ title }}</h3>
		<p :title="$t('article.connections', { linkCount: linkCount })">{{ linkCount }}</p>
	</div>
</template>

<style>
	@keyframes zoom {
		from {
			transform: scale(10);
		}

		to {
			transform: scale(1);
		}
	}

	.node {
		position: absolute;
		background: var(--node-bg-color);
		width: 8em;
		height: 8em;
		margin-left: -4em;
		margin-top: -4em;
		border: 3px solid var(--normal-node-color);
		border-radius: 10em;
		text-align: center;
		overflow: hidden;
		background-size: cover;
		background-position: center center;
		box-shadow: 0 0 var(--node-outer-shadow-strength) var(--normal-node-outer-shadow-color), inset 0 0 var(--node-inner-shadow-strength) var(--normal-node-inner-shadow-color);
		animation: 0.5s ease normal zoom;

		&.start {
			border-color: var(--start-node-color);
			box-shadow: 0 0 var(--node-outer-shadow-strength) var(--start-node-outer-shadow-color), inset 0 0 var(--node-inner-shadow-strength) var(--start-node-inner-shadow-color);

			h3 {
				border-color: var(--start-node-color);
				box-shadow: 0 0 var(--node-outer-shadow-strength) var(--start-node-inner-shadow-color);
			}

			p {
				border-color: var(--start-node-color);
			}
		}

		&.bomb {
			border-color: var(--bomb-node-color);
			box-shadow: 0 0 var(--node-outer-shadow-strength) var(--bomb-node-outer-shadow-color), inset 0 0 var(--node-inner-shadow-strength) var(--bomb-node-inner-shadow-color);

			h3 {
				border-color: var(--bomb-node-color);
				box-shadow: 0 0 var(--node-outer-shadow-strength) var(--bomb-node-inner-shadow-color);
			}

			p {
				border-color: var(--bomb-node-color);
			}
		}


		h3 {
			font-size: 1em;
			margin-top: 5em;
			margin-bottom: 0;
			padding: 0;
			border-top: 3px solid var(--normal-node-color);
			border-bottom: 3px solid var(--normal-node-color);
			background-color: var(--node-label-bg-color);
			text-wrap: nowrap;
			overflow: hidden;
			box-shadow: 0 0 var(--node-inner-shadow-strength) var(--normal-node-inner-shadow-color);
		}

		p {
			opacity: 0;
			border-bottom: 3px solid var(--normal-node-color);
			margin: 0;
			background-color: var(--node-label-hover-bg-color);

			&:before {
				filter: brightness(0);
				content: "🔗 ";
			}
		}

		&:hover {
			p {
				opacity: 1;
			}

			h3 {
				background-color: var(--node-label-hover-bg-color);
				border-bottom-width: 1px;
			}
		}
	}
</style>