<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { useUserStore } from "../../stores/user";
import { fetchy } from "../../utils/fetchy";

const { currentUsername } = useUserStore();
const loaded = ref(false);
const badges = ref<Array<Record<string, string>>>([]);

async function getBadges() {
  let badgeResults;
  try {
    badgeResults = await fetchy(`/api/badges/${currentUsername}`, "GET", {});
  } catch (_) {
    return;
  }
  badges.value = badgeResults;
}

onBeforeMount(async () => {
  await getBadges();
  loaded.value = true;
});
</script>

<template>
  <div class="container">
    <div v-for="badge in badges" :key="badge._id">
      <div class="tool-tip">
        <!-- <div v-if="badge.count != '0'" class="tool-tip"> -->
        <span class="badge" @click="$router.push('/tasks')">
          <img v-bind:src="badge.icon" />
          <span class="count">{{ badge.count }}</span>
          <p>{{ badge.name }}</p>
        </span>
        <span class="tool-tip-text">{{ badge.description }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  margin-top: 2em;
}

.badge {
  padding: 1em 4em 0 4em;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}

.badge:hover {
  background-color: var(--base-bg);
}

.count {
  background-color: var(--dark-purple);
  color: white;
  position: absolute;
  top: 0;
  right: 2em;
  z-index: 1;
  font-size: 2em;
  margin: 0.2em;
  padding: 0 0.2em 0 0.2em;
  border-radius: 0.2em;
}

img {
  width: 8em;
}
</style>
