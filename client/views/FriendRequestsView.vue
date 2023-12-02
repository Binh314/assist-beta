<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import FriendComponent from "../components/Friend/FriendComponent.vue";
import { fetchy } from "../utils/fetchy";

const loaded = ref(false);
let requesters = ref<Array<Record<string, string>>>([]);

async function getIncomingFriendRequests() {
  let requestResults;
  try {
    requestResults = await fetchy(`/api/friend/incomingRequests`, "GET");
  } catch {
    return;
  }
  requesters.value = requestResults;
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
  <h1 v-if="requesters.length === 0">No requests!</h1>
  <div class="section">
    <div v-for="user in requesters" :key="user._id">
      <FriendComponent :username="user.username" :picture="user.picture" />
      <span>
        <button @click="acceptRequest(user.username)" class="pure-button-primary pure-button">Accept</button>
        <button @click="rejectRequest(user.username)" class="button-error pure-button">Reject</button>
      </span>
    </div>
  </div>
</template>

<style scoped>
h1 {
  text-align: center;
}

.section {
  display: flex;
  flex-direction: row;
  padding: 2em;
}
</style>
