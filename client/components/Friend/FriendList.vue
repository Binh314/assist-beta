<script setup lang="ts">
import FriendComponent from "@/components/Friend/FriendComponent.vue";
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const loaded = ref(false);
let friends = ref<Array<Record<string, string>>>([]);

async function getFriends() {
  let friendResults;
  try {
    friendResults = await fetchy(`/api/friends`, "GET");
  } catch {
    return;
  }
  friends.value = friendResults;
}

onBeforeMount(async () => {
  await getFriends();
  loaded.value = true;
});
</script>

<template>
  <div v-if="loaded" class="section">
    <p v-if="friends.length === 0">No friends yet!</p>
    <div v-for="friend in friends" :key="friend._id">
      <FriendComponent :username="friend.username" :picture="friend.picture" />
    </div>
  </div>
  <div v-else>Loading...</div>
</template>

<style scoped>
.section {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  gap: 2em;
  padding: 2em;
}
</style>
