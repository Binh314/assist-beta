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
  <div>
    <h3>{{ props.challenge.description }}</h3>
    <p>Expires on: {{ formatDate(props.challenge.endTime) }}</p>
    <p v-if="progress < props.challenge.goal">Progress: {{ progress }} / {{ props.challenge.goal }}</p>
    <p v-else>Progress: Complete! Badge Awarded!</p>
    <hr />
  </div>
</template>

<style scoped></style>
