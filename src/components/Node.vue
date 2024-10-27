<script setup lang="ts">
	import { nextTick, onMounted, useTemplateRef } from 'vue';

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

	const titleElem = useTemplateRef("titleElem");

	const props = defineProps<{
		id: number,
		title: string,
		thumbnail: string,
		linkCount: number,
		style: string,
		position: Position,
		showLink: boolean
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

	onMounted(async () => {
		if (props.showLink) {
			return;
		}
		let size = 1;
		while (size > 0.5 && titleElem.value!.scrollWidth > titleElem.value!.offsetWidth) {
			size -= 0.05;
			titleElem.value!.querySelector("span")!.style.fontSize = `${size}em`;
			await nextTick();
		}
	});
</script>

<template>
	<div :class="['node', style]" :style="{ backgroundImage: 'url(' + thumbnail + ')', left: `${position.x}px`, top: `${position.y}px` }" draggable="true" @mouseover="onMouseOver" @mouseout="onMouseOut" @click="onClick" @dragend="onDrop">
		<h3 :title="title" ref="titleElem">
			<span v-if="!showLink">{{ title }}</span>
			<a v-if="showLink" :href="`https://en.wikipedia.org/?curid=${id}`">{{ title }}</a>
		</h3>
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
		cursor: move;

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
			display: flex;
			justify-content: center;
			align-items: center;
			height: 1.4em;
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

			span {
				padding: 0 1em;
			}

			a {
				color: var(--node-link-color);
				text-decoration: none;
				padding: 0 1em;

				&:before {
					display: inline-block;
					content: "⎋";
					padding-left: 0.25em;
					transform: scaleX(-1);
					font-weight: normal;
				}
			}
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