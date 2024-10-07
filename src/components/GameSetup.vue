<script setup lang="ts">
import type Result from '@/domain/result.ts';
import Game, { GameMode, type Language } from '../services/game.ts';
import { Difficulty, getDifficultySetting } from '@/domain/difficulty.ts';
import { useI18n } from 'vue-i18n';


const emit = defineEmits<{
  (e: 'started', game: Game, result: Result): void
}>();

const language = defineModel<string>('language', { default: 'en'});
const type = defineModel<string>('type', { default : 'curated'});
const difficulty = defineModel<number>('difficulty', { default : 0});
const i18n = useI18n();

function languageChanged() {
  i18n.locale.value = language.value;
}

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
      <h1>{{ $t('title') }}</h1>
      <div>
        <section class="settings">
          <h2>{{ $t('settings') }}</h2>
          <fieldset>
            <label for="language">{{ $t('language.select') }}</label>
            <select id="language" v-model="language" @change="languageChanged">
              <option value="en">🇺🇸 {{ $t('language.en') }}</option>
              <option value="sv">🇸🇪 {{ $t('language.sv') }}</option>
            </select>
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
            <label for="difficulty">{{ $t('difficulty') }}</label>
            <input id="difficulty" type="range" list="difficulties" min="0" max="4" v-model.number="difficulty"/>
            <span class="difficulty-smiley">{{ getDifficultySetting(difficulty).smiley }}</span>
            
            <datalist id="difficulties">
              <option v-for="([value, key], idx) in Object.entries(Difficulty).filter(([_, k]) => Number.isInteger(k))" :value="key">{{ value }}</option>
            </datalist>
          </fieldset>
        </section>
        <section class="rules">
          <h2>{{ $t('instructions.title') }}</h2>
          <p>{{ $t('instructions.text', { articles: getDifficultySetting(difficulty).articles, bombs: getDifficultySetting(difficulty).bombs }) }}
          </p>
        </section>
      </div>
      <input type="button" :value="$t('button.start')" @click.prevent="startGame"/>
    </form>
  </dialog>
</template>

