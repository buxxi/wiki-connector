<script setup lang="ts">
    const props = defineProps<{
        start: number,
        bombs: number,
        found: number,
        possibleLinks: number,
        time: number
    }>();

    const emit = defineEmits<{
        (e: 'restart'): void
    }>();


    function formatTime(seconds: number) : string {
        let minutes = Math.floor(seconds / 60);
        seconds = seconds - (minutes * 60);
        return minutes.toString().padStart(2, '0') + ":" + seconds.toString().padStart(2, '0');
    }
</script>

<template>
    <div id="info">
        <form>
            <input type="button" id="restart" :value="$t('button.restart')" @click="emit('restart')"/>
        </form>
        <div>
            <dl>
                <dt :title="$t('info.start')">🎖️</dt>
                <dd>{{ start }}</dd>
            </dl>
            <dl>
                <dt :title="$t('info.bombs')">🧨</dt>
                <dd>{{ bombs }}</dd>
            </dl>
            <dl>
                <dt :title="$t('info.found')">✅</dt>
                <dd>{{ found }}</dd>
            </dl>
            <dl>
                <dt :title="$t('info.possible')">🔗</dt>
                <dd>{{ possibleLinks }}</dd>
            </dl>
            <dl>
                <dt :title="$t('info.time')">🕗</dt>
                <dd>{{ formatTime(time) }}</dd>
            </dl>
        </div>
    </div>
</template>