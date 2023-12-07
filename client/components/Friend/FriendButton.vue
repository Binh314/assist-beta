<script setup lang="ts">
import FriendComponent from "@/components/Friend/FriendComponent.vue";
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["friend"]);
const status = ref("");
const isDeleteVisible = ref(false);
const picture = ref("");

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
}

async function openDeleteModal() {
  isDeleteVisible.value = true;
}

async function closeDeleteModal() {
  isDeleteVisible.value = false;
}

onBeforeMount(async () => {
  await getStatus();
  const user = await fetchy(`/api/users/${props.friend}`, "GET", {alert: false});
  picture.value = user.picture;
});
</script>

<template>
  <button v-if="status == 'none'" class="pure-button-primary pure-button theme" @click="addFriend">Add Friend</button>
  <button v-else-if="status == 'friends'" class="button-error pure-button theme" @click="openDeleteModal">Remove Friend</button>
  <button v-else-if="status == 'sent'" class="button-error pure-button theme" @click="removeRequest">Unsend Friend Request</button>
  <div v-else-if="status == 'received'">
    <button class="pure-button-primary pure-button theme space" @click="acceptRequest">Accept Friend Request</button>
    <button class="button-error pure-button theme space" @click="rejectRequest">Reject Friend Request</button>
  </div>
  <div v-if="isDeleteVisible" class="modal-overlay">
    <div class="modal-content confirmMenu">
      <h1>Are you sure you want to unfriend {{ props.friend }}?</h1>
      <div class="friendInfo">
        <FriendComponent class="friendProfile" :username="friend" :picture="picture"/>
      </div>
      <menu class="confirmOptions">
        <button @click="removeFriend" class="pure-button">Remove Friend</button>
        <button @click="closeDeleteModal" class="pure-button button-error">Cancel</button>
      </menu>
    </div>
  </div>
</template>

<style scoped>
.friendInfo {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.friendInfo:hover {
  cursor: default;
}

.friendProfile:hover {
  cursor: default;
}

button {
  margin-top: 1em;
}
.theme {
  background-color: var(--purple);
}

.theme:hover {
  background-color: var(--light-pink);
}

.space {
  margin-left: 1em;
  margin-right: 1em;
}

menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 1em;
  padding: 0;
  margin: 0;
}
.confirmOptions {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}
.confirmMenu {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

</style>
