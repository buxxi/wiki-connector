<script setup lang="ts">
    import { computed, reactive, ref, watch } from 'vue';

    const props = defineProps<{
        suggestions: string[]
    }>();
    const emit = defineEmits<{
        (e: 'type', value: string): void
        (e: 'guess', value: string): void
    }>();
    defineExpose({
        clear: clearGuess,
        invalidInput: shake
    });
    const guess = defineModel<string>('guess');
    const index = reactive({value: 0});
    const classes = ref<string[]>(['user-guess']);

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

    watch(props.suggestions, () => {
        index.value = 0;
    });

    function clearGuess() {
        guess.value = "";
    }

    function shake() {
        classes.value.push('shake');
    }

    function shakeEnd() {
        let i = classes.value.indexOf('shake');
        classes.value.splice(i);
    }

    function performAutocomplete() {
        const suggestions = props.suggestions;
        if (suggestions.length > 0) {
            guess.value = suggestions[index.value];
        }
    }

    function previousAutocomplete() {
        const suggestions = props.suggestions;
        index.value = (suggestions.length + index.value - 1) % suggestions.length;
    }

    function nextAutocomplete() {
        const suggestions = props.suggestions;
        index.value = (index.value + 1) % suggestions.length;
    }

    function makeGuess() {
        if (guess.value != undefined) {
            emit('guess', guess.value);
        }
    }

    async function emitChange(event: KeyboardEvent) {
        if (guess.value != undefined && !['tab', 'arrowdown', 'arrowup', 'enter'].includes(event.key.toLowerCase())) {
            emit('type', guess.value);
        }
    }

</script>

<template>
    <div id="guess">
        <form>
            <input type="text" :class="classes" v-model="guess" 
                @keydown.tab.prevent="performAutocomplete" 
                @keyup.up.prevent="previousAutocomplete" 
                @keyup.down.prevent="nextAutocomplete" 
                @keyup.enter.prevent="makeGuess"
                @keyup="emitChange"
                @animationend="shakeEnd"/>
            <input type="text" class="autocomplete" :value="autocomplete" disabled/>
        </form>
    </div>
</template>