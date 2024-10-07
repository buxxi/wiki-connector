<script setup lang="ts">
    const props = defineProps<{
        found: number,
        possible: number
    }>();
    //TODO: implement timer
    //TODO: implement score
</script>

<template>
    <div id="info">
        <form>
            <input type="button" id="restart" :value="$t('button.restart')"/>
        </form>
        <div>
            <dl>
                <dt>{{ $t('info.found') }}</dt>
                <dd>{{ found }}</dd>
            </dl>
            <dl>
                <dt>{{ $t('info.possible') }}</dt>
                <dd>{{ possible }}</dd>
            </dl>
        </div>
    </div>
</template>