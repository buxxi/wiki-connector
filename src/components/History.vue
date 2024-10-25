<script setup lang="ts">
	import type { HistoryEntry } from '@/services/history';
	import TimeFormat from './TimeFormat.vue';
	import { getDifficultySetting } from '@/domain/difficulty';

	const props = defineProps<{
		entries: HistoryEntry[];
	}>();
</script>

<template>
	<table>
		<thead>
			<tr>
				<th>{{ $t('history.date') }}</th>
				<th>{{ $t('history.won') }}</th>
				<th>{{ $t('difficulty.title') }}</th>
				<th>{{ $t('info.time') }}</th>
				<th>{{ $t('info.bombs') }}</th>
				<th>{{ $t('history.shortest') }}</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="entry in entries">
				<td>{{ entry.date.toISOString().substring(0, 10) }}</td>
				<td class="result"><span :class="{ won: entry.won, lost: !entry.won }">{{ entry.won ? '✓' : '✕' }}</span></td>
				<td><i>{{ getDifficultySetting(entry.difficulty).smiley }}</i> {{ $t('difficulty.' + entry.difficulty)
					}}</td>
				<td>
					<TimeFormat :seconds="entry.seconds"></TimeFormat>
				</td>
				<td>{{ entry.bombs }}</td>
				<td>{{ entry.shortest != undefined ? entry.shortest : '-' }}</td>
			</tr>
		</tbody>
	</table>
</template>

<style>
	table {
		background: var(--history-bg-color);
		text-align: center;
		width: 100%;
		border-collapse: collapse;

		thead {
			position: sticky;
			top: 0;
			background-color: var(--history-header-bg-color);
			font-weight: bold;
			color: var(--history-header-text-color);
		}

		th,
		td {
			padding: 0.1em 0.25em;
		}

		tbody tr:first-of-type {
			background-color: var(--history-current-game-row-bg-color);
		}

		.result span {
			color: white;
			font-weight: bold;
			border-radius: 1em;
			width: 1.25em;
			height: 1.25em;
			line-height: 1.25em;
			display: inline-block;

			&.won {
				background-color: var(--history-won-color);
			}

			&.lost {
				background-color: var(--history-loss-color);
			}
		}
	}
</style>