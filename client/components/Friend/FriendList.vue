<script setup lang="ts">
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
  <div class="row">
    <article v-if="loaded">
      <p v-if="friends.length === 0">No friends yet!</p>
      <div v-for="friend in friends" :key="friend._id">
        <img v-bind:src="friend.picture" />
        <h4>{{ friend.username }}</h4>
      </div>
    </article>
  </div>
</template>

<style scoped></style>
