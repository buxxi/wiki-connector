<script setup lang="ts">
import type Result from '@/domain/result.ts';
import Game, { GameMode, type Language } from '../services/game.ts';
import { Difficulty, getDifficultySetting } from '@/domain/difficulty.ts';


const emit = defineEmits<{
  (e: 'started', game: Game, result: Result): void
}>();

const language = defineModel<string>('language', { default: 'en'});
const type = defineModel<string>('type', { default : 'curated'});
const difficulty = defineModel<number>('difficulty', { default : 0});

async function startGame() {
  let game = new Game();
  let gameMode = type.value as GameMode;
  let selectedDifficulty = getDifficultySetting(difficulty.value);
  let result = await game.start(language.value as Language, selectedDifficulty.articles, selectedDifficulty.bombs, gameMode);
  emit('started', game, result);
}
</script>


<template>
  <dialog open>
    <form>
      <h1>Wiki connector</h1>
      <div>
        <section class="settings">
          <h2>Settings</h2>
          <fieldset>
            <label for="language">Language</label>
            <select id="language" v-model="language">
              <option value="en">🇺🇸 English</option>
              <option value="sv">🇸🇪 Swedish</option>
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
            <label for="difficulty">Difficulty</label>
            <input id="difficulty" type="range" list="difficulties" min="0" max="4" v-model.number="difficulty"/>
            <span class="difficulty-smiley">{{ getDifficultySetting(difficulty).smiley }}</span>
            
            <datalist id="difficulties">
              <option v-for="([value, key], idx) in Object.entries(Difficulty).filter(([_, k]) => Number.isInteger(k))" :value="key">{{ value }}</option>
            </datalist>
          </fieldset>
        </section>
        <section class="rules">
          <h2>How to play</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam a rhoncus ex. <b>{{  getDifficultySetting(difficulty).articles }}</b><br/>
            Cras venenatis efficitur nulla quis consequat <b>{{  getDifficultySetting(difficulty).bombs }}</b>. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.<br/>
            Fusce hendrerit tempus nisi, in congue urna. Sed pretium magna ac ex semper pharetra. Pellentesque sit amet rutrum metus. 
          </p>
        </section>
      </div>
      <input type="button" value="Start" @click.prevent="startGame"/>
    </form>
  </dialog>
</template>

