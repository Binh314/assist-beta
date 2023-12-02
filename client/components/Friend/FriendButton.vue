<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["friend"]);
const status = ref("");

async function addFriend() {
  try {
    await fetchy(`/api/friend/requests/${props.friend}`, "POST");
  } catch {
    return;
  }
  await getStatus();
}

async function removeFriend() {
  try {
    await fetchy(`/api/friends/${props.friend}`, "DELETE");
  } catch {
    return;
  }
  await getStatus();
}

async function acceptRequest() {
  try {
    await fetchy(`/api/friend/accept/${props.friend}`, "PUT");
  } catch {
    return;
  }
  await getStatus();
}

async function removeRequest() {
  try {
    await fetchy(`/api/friend/requests/${props.friend}`, "DELETE");
  } catch {
    return;
  }
  await getStatus();
}

async function rejectRequest() {
  try {
    await fetchy(`/api/friend/reject/${props.friend}`, "PUT");
  } catch {
    return;
  }
  await getStatus();
}

async function getStatus() {
  let result;
  try {
    result = await fetchy(`/api/friend/status/${props.friend}`, "GET");
  } catch {
    return;
  }
  status.value = result;
  console.log(status.value);
}

onBeforeMount(async () => {
  await getStatus();
});
</script>

<template>
  <button v-if="status == 'none'" class="pure-button-primary pure-button" @click="addFriend">Add Friend</button>
  <button v-else-if="status == 'friends'" class="button-error pure-button" @click="removeFriend">Remove Friend</button>
  <button v-else-if="status == 'sent'" class="button-error pure-button" @click="removeRequest">Unsend Friend Request</button>
  <div v-else-if="status == 'received'">
    <button class="pure-button-primary pure-button" @click="acceptRequest">Accept Friend Request</button>
    <button class="button-error pure-button" @click="rejectRequest">Reject Friend Request</button>
  </div>
</template>

<style scoped></style>
