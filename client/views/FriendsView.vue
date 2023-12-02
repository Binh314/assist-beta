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
  <div class="container">
    <SearchUser />
    <div class="requests" @click="$router.push('/requests')">
      <span>Friend requests</span>
      <button>{{ pendingRequests }}</button>
    </div>
    <FriendList />
  </div>
</template>

<style scoped>
h1 {
  text-align: center;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.requests {
  display: inline-block;
  color: var(--dark-purple);
  font-size: 1.5em;
  cursor: pointer;
  gap: 1em;
  padding: 0.5em;
  margin: 1.5em;
}

.requests:hover {
  background-color: var(--light-pink);
}
</style>
