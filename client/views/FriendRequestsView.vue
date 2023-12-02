<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../utils/fetchy";

const loaded = ref(false);
let incomingRequests = ref<Array<Record<string, string>>>([]);

async function getIncomingFriendRequests() {
  let requestResults;
  try {
    requestResults = await fetchy(`/api/friend/incomingRequests`, "GET");
  } catch {
    return;
  }
  incomingRequests.value = requestResults;
}

async function acceptRequest(friend: string) {
  try {
    await fetchy(`/api/friend/accept/${friend}`, "PUT");
  } catch {
    return;
  }
  await getIncomingFriendRequests();
}

async function rejectRequest(friend: string) {
  try {
    await fetchy(`/api/friend/reject/${friend}`, "PUT");
  } catch {
    return;
  }
  await getIncomingFriendRequests();
}

onBeforeMount(async () => {
  await getIncomingFriendRequests();
  loaded.value = true;
});
</script>

<template>
  <h1 v-if="incomingRequests.length === 0">No requests!</h1>
  <div v-for="request in incomingRequests" :key="request._id">
    <p>{{ request.from }}</p>
    <span>
      <button @click="acceptRequest(request.from)" class="button-success pure-button">Accept</button>
      <button @click="rejectRequest(request.from)" class="button-error pure-button">Reject</button>
    </span>
  </div>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
