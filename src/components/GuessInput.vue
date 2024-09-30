<script setup lang="ts">
    import { computed, reactive } from 'vue';

    const props = defineProps<{
        suggestions: string[]
    }>();
    const emit = defineEmits<{
        (e: 'type', value: string): void
        (e: 'guess', value: string): void
    }>();
    defineExpose({
        clear: clearGuess
    });
    const guess = defineModel<string>('guess');
    const index = reactive({value: 0});

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

    function clearGuess() {
        guess.value = "";
    }

    function nextAutocomplete() {
        //TODO: maybe separate keys, tab for using suggestion and arrows to jump between them?
        const suggestions = props.suggestions;
        if (guess.value != undefined && suggestions[index.value] != guess.value && suggestions[index.value].startsWith(guess.value)) {
            guess.value = suggestions[index.value];
        } else {
            index.value = (index.value + 1) % suggestions.length;
        }
    }

    function makeGuess() {
        if (guess.value != undefined) {
            emit('guess', guess.value);
        }
    }

    async function emitChange(event: KeyboardEvent) {
        if (guess.value != undefined && event.key != 'Tab') {
            emit('type', guess.value);
        }
    }

</script>

<template>
    <div id="guess">
        <form>
            <input type="text" class="user-guess" v-model="guess" @keydown.tab.prevent="nextAutocomplete" @keyup.enter.prevent="makeGuess" @keyup="emitChange"/>
            <input type="text" class="autocomplete" :value="autocomplete" disabled/>
        </form>
    </div>
</template>