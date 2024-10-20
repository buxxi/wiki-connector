<script setup lang="ts">
    import TimeFormat from './TimeFormat.vue';

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
                <dd><TimeFormat :seconds="time"></TimeFormat></dd>
            </dl>
        </div>
    </div>
</template>

<style>
#restart {
  position: fixed;
  right : 0.5em;
  bottom : 0.5em;
  font-size: 2em;
}

#info {
  position: fixed;
  color: var(--info-text-color);
  background-color: var(--info-bg-color);
  bottom: 0;
  height : 5em;
  left: 0;
  right: 0;
  dt {
    font-family: "Noto Color Emoji";
    text-shadow: 0 0 var(--info-icon-shadow-strength) var(--info-icon-shadow-color);
    font-size: 2em;
  }
  dd {
    text-shadow: 0 0 var(--info-text-shadow-strength) var(--info-text-shadow-color);
    font-size: 2em;
  }
}
</style>