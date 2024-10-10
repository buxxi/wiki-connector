<script setup lang="ts">
import { ref } from 'vue';

  const props = defineProps<{
      won: boolean
  }>();

  const emit = defineEmits<{
    (e: 'restart'): void,  
  }>();

  var open = ref<boolean>(true);

  function closeModal() {
    open.value = false;
  }

  function newGame() {
    emit('restart');
  }
</script>

<template>
  <dialog :open="open">
    <a @click="closeModal" class="close">✕</a>
    <h1>{{ won ? $t('won.title') : $t('lost.title') }}</h1>
    <div>
        <section class="results">
          <h2>{{ $t('Results') }}</h2>
          <p v-if="!won">Oops! You connected <b>TODO</b> with <b>TODO</b> which was one of the bombs.</p>
          <p v-if="won">
            You connected <b>TODO</b> with <b>TODO</b>, <b>TODO</b> and <b>TODO</b> and avoided all bombs!<br/>
            And all this in only <b>TODO</b> steps in <b>TODO</b> time, well done!
          </p>
        </section>

        <section class="history">
          <h2>{{ $t('History') }}</h2>
          <div>
            <table>
              <thead>
                <th>Date</th>
                <th>Won</th>
                <th>Difficulty</th>
                <th>Time</th>
                <th>Bombs</th>
                <th>Shortest</th>
              </thead>
              <tbody>
                <tr>
                  <td>2011-12-13</td>
                  <td class="won">✓</td>
                  <td>😁 Easy</td>
                  <td>00:44</td>
                  <td>33</td>
                  <td>4</td>
                </tr>
                <tr>
                  <td>2024-10-10</td>
                  <td class="lost">✕</td>
                  <td>🥵 Hard</td>
                  <td>00:04</td>
                  <td>2</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>2024-10-10</td>
                  <td class="lost">✕</td>
                  <td>🥵 Hard</td>
                  <td>00:04</td>
                  <td>2</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>2024-10-10</td>
                  <td class="lost">✕</td>
                  <td>🥵 Hard</td>
                  <td>00:04</td>
                  <td>2</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>2024-10-10</td>
                  <td class="lost">✕</td>
                  <td>🥵 Hard</td>
                  <td>00:04</td>
                  <td>2</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>2024-10-10</td>
                  <td class="lost">✕</td>
                  <td>🥵 Hard</td>
                  <td>00:04</td>
                  <td>2</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>2024-10-10</td>
                  <td class="lost">✕</td>
                  <td>🥵 Hard</td>
                  <td>00:04</td>
                  <td>2</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>2024-10-10</td>
                  <td class="lost">✕</td>
                  <td>🥵 Hard</td>
                  <td>00:04</td>
                  <td>2</td>
                  <td>-</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
    </div>
    <div class="buttons">
      <input type="button" value="New game" @click="newGame"/>
    </div>
  </dialog>
</template>
