<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import { formatDate } from "../../utils/formatDate";

const props = defineProps(["challenge"]);
const loaded = ref(false);
const progress = ref(0);

async function getProgress() {
  let progressResults;
  try {
    progressResults = await fetchy(`/api/challenges/${props.challenge._id}/progress`, "GET", {});
  } catch (_) {
    return;
  }
  progress.value = progressResults;
}

onBeforeMount(async () => {
  await getProgress();
  loaded.value = true;
});
</script>

<template>
  <div class="container">
    <div>
      <h3>{{ props.challenge.description }}</h3>
      <p><b>Expires on:</b> {{ formatDate(props.challenge.endTime) }}</p>
      <p v-if="progress < props.challenge.goal"><b>Progress:</b> {{ progress }} / {{ props.challenge.goal }}</p>
      <p v-else><b>Progress:</b> Complete! Badge Awarded!</p>
    </div>
    <button class="pure-button" @click="$router.push('/tasks')">{{ $props.challenge.name }}</button>
  </div>
  <hr />
</template>

<style scoped>
.container {
  max-width: 50em;
  display: flex;
  align-items: center;
}
</style>
