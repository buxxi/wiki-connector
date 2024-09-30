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
            <input type="button" id="restart" value="Restart"/>
        </form>
        <div>
            <dl>
                <dt>Found articles</dt>
                <dd>{{ found }}</dd>
            </dl>
            <dl>
                <dt>Possible links</dt>
                <dd>{{ possible }}</dd>
            </dl>
        </div>
    </div>
</template>