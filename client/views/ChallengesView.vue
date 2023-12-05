<script setup lang="ts">
import Badges from "../components/Badge/BadgeList.vue";
import Challenges from "../components/Challenges/ChallengeList.vue";
import { fetchy } from "../utils/fetchy";

async function createChallenges() {
  await fetchy("/api/challenges", "POST", { body: {} });
}
</script>

<template>
  <div class="row">
    <Badges />
  </div>
  <div class="row">
    <h1>Challenges</h1>
    <Challenges />
  </div>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
