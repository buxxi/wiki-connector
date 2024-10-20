<script setup lang="ts">
    import type { HistoryEntry } from '@/services/history';
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
        <td :class="{won: entry.won, lost: !entry.won}">{{ entry.won ? '✓' : '✕' }}</td>
        <td>{{ getDifficultySetting(entry.difficulty).smiley }} {{ $t('difficulty.' + entry.difficulty) }}</td>
        <td><TimeFormat :seconds="entry.seconds"></TimeFormat></td>
        <td>{{ entry.bombs }}</td>
        <td>{{ entry.shortest != undefined ? entry.shortest : '-' }}</td>
        </tr>
    </tbody>
    </table>
</template>

<style>
    table {
      text-align: center;
      width : 100%;
      border-collapse: collapse;
      thead {
        position: sticky;
        top: 0;
        background-color: #444;
        font-weight: bold;
        color: #eee;
      }
      th, td {
        padding: 0.1em 0.25em;
      }
      tbody tr:first-of-type {
        background-color: gray;
      }
      .won {
        color: yellowgreen;
        font-weight: bold;
      }
      .lost {
        color: orangered;
        font-weight: bold;
      }
    }
</style>