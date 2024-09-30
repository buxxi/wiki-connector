<script setup lang="ts">
import type Result from '@/domain/result.ts';
import Game, { GameMode, type Language } from '../services/game.ts';

const emit = defineEmits<{
  (e: 'started', game: Game, result: Result): void
}>();

const language = defineModel<string>('language', { default: 'en'});
const type = defineModel<string>('type', { default : 'curated'});
const articles = defineModel<number>('articles', { default : 2});
const bombs = defineModel<number>('bombs', { default : 1});

async function startGame() {
  let game = new Game();
  let gameMode = type.value as GameMode;
  let result = await game.start(language.value as Language, articles.value, bombs.value, gameMode);
  emit('started', game, result);
}
</script>


<template>
  <dialog open>
    <h1>Wiki connector {{ language }}</h1>
    <form>
      <fieldset>
        <label for="language">Language</label>
        <select id="language" v-model="language">
          <option value="en">English</option>
          <option value="sv">Swedish</option>
        </select>
      </fieldset>
      <fieldset>
        <label for="type">Type</label>
        <select id="type" v-model="type">
          <option value="curated">Curated</option>
          <option value="random">Random</option>
          <option value="popular">Popular</option>
        </select>
      </fieldset>
      <fieldset>
        <label for="articles">Articles</label>
        <select id="articles" v-model="articles" disabled>
          <option value="2">2</option>
        </select>
      </fieldset>
      <fieldset>
        <label for="bombs">Bombs</label>
        <select id="bombs" v-model="bombs">
          <option value="0">0</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
      </fieldset>
      <input type="button" value="Start" @click.prevent="startGame"/>
    </form>
  </dialog>
</template>

