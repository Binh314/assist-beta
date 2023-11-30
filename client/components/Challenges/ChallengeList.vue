<script setup lang="ts">
import Challenge from "@/components/Challenges/ChallengeComponent.vue";
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const loaded = ref(false);
const challenges = ref<Array<Record<string, any>>>([]);

async function getChallenges() {
  let challengeResults;
  try {
    challengeResults = await fetchy("/api/challenges", "GET", {});
  } catch (_) {
    return;
  }
  challenges.value = challengeResults;
}

onBeforeMount(async () => {
  await getChallenges();
  loaded.value = true;
});
</script>

<template>
  <div class="container">
    <div v-for="challenge in challenges" :key="challenge._id">
      <Challenge :challenge="challenge" />
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  align-items: center;
  flex-direction: column;
}
</style>
