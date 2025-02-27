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
  <h2 v-if="requesters.length === 0">No pending friend requests!</h2>
  <h2 v-else>Friend Requests</h2>
  <div class="link">
    <a @click="$router.push('friends')">return to previous page</a>
  </div>

  <div class="section">
    <div v-for="user in requesters" :key="user._id">
      <div class="user">
        <FriendComponent :username="user.username" :picture="user.picture" />
        <span>
          <button @click="acceptRequest(user.username)" class="pure-button-primary pure-button theme">Accept</button>
          <button @click="rejectRequest(user.username)" class="button-error pure-button theme">Reject</button>
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
h2 {
  text-align: center;
  margin-top: 2em;
  margin-bottom: 0;
}

.link {
  margin-top: 1em;
  text-align: center;
  background-color: white;
}

.user {
  padding: 2em 0;
}
.user:hover {
  background-color: var(--base-bg);
}

a {
  cursor: pointer;
}

a:hover {
  background-color: var(--light-pink);
}

.section {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 2em;
  padding: 2em;
  text-align: center;
}

.theme {
  margin-left: 0.25em;
  margin-right: 0.25em;
  background-color: var(--purple);
}

.theme:hover {
  background-color: var(--dark-purple);
}
</style>
