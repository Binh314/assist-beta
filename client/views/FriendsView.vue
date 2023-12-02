<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import FriendList from "../components/Friend/FriendList.vue";
import SearchUser from "../components/Friend/SearchUser.vue";
import { fetchy } from "../utils/fetchy";

const pendingRequests = ref(0);

async function getRequestCount() {
  let requestResults;
  try {
    requestResults = await fetchy(`/api/friend/incomingRequests`, "GET");
  } catch {
    return;
  }
  pendingRequests.value = requestResults.length;
}

onBeforeMount(async () => {
  await getRequestCount();
});
</script>

<template>
  <div class="row">
    <SearchUser />
  </div>
  <div class="row requests" @click="$router.push('/requests')">
    <span>Friend requests</span>
    <button>{{ pendingRequests }}</button>
  </div>
  <div class="row">
    <FriendList />
  </div>
</template>

<style scoped>
h1 {
  text-align: center;
}

.requests {
  cursor: pointer;
  display: flex;
  justify-content: center;
  gap: 1em;
  padding: 2em;
}
</style>
