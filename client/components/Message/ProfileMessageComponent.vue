<script setup lang="ts">

import router from "@/router";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, onBeforeUnmount, ref } from "vue";
import { useRoute, } from "vue-router";

const { isLoggedIn, currentUsername } = storeToRefs(useUserStore());

const currentRoute = useRoute();
const props = defineProps(["username"]);
const interval = ref();
const message = ref("");
const loaded = ref(false);
const emit = defineEmits(["sendMessage"]);

let profile = ref<Record<string, string>>({});


async function getProfile() {
  let profileResult;
  try {
    profileResult = await fetchy(`/api/users/${props.username}`, "GET")
  } catch (_) {
    return;
  }
  profile.value = profileResult;
}

async function goToMessages() {
  void router.push(`/messages/${props.username}`);
}

async function goToProfile() {
  void router.push(`/profile/${props.username}`);
}

async function getMessages() {
  let messageResults;
  try {
    messageResults = await fetchy(`/api/message/user/${props.username}`, "GET")
  } catch (_) {
    return;
  }
  if (messageResults[0].text !== message.value) emit("sendMessage");
  message.value = messageResults[0].text;
}

onBeforeMount(async () => {
  await getProfile();
  await getMessages();
  loaded.value = true;
  interval.value = setInterval(getMessages, 1000);
});

onBeforeUnmount(async () => {
  clearInterval(interval.value);
});

</script>

<template>
  <div class="container" @click="goToMessages">
    <img v-if="profile.picture" :src="profile.picture" @click.stop="goToProfile"/>
    <div class="header" @click="goToMessages">
      <h2>
      <span class="name"> {{ profile.username }} </span>
      <span class="username"> @{{ props.username }} </span>
      </h2>
      <p> {{message}}</p>
    </div>
  </div>
</template>

<style scoped>
.container {
  display:flex;
  align-items: stretch;
  margin-right: 1em;
  margin-left: 1em;
  gap: 0.5em;
  padding: 1em;
  background-color: var(--base-bg);
  border-radius: 1em;
  border-style: solid;
  /* box-shadow: 1em 1em 1em black; */
  border-width: .25em;
}

.container:hover {
  cursor: pointer;
  background-color: lightgrey;
}

.header {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-left: 1em;
}

.username {
  font-size: smaller;
  font-weight: normal;
}

.name {
  font-weight: bold;
}

img {
  object-fit: cover;
  height: 3em;
  aspect-ratio: 1;
  cursor:pointer;
  border-radius: 1em;
}


article:hover {
  background-color: darkgray;
}

article {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}


label {
  padding-top: 1em;
}
.dropdownButton {
  width: 10em;
}

.host {
  font-weight: normal;
}

h2 {
  margin-top: 0;
  margin-bottom: 0;
}
p {
  margin: 0em;
}

.photo{
  max-width: 75%;
}

.title {
  font-weight: bold;
}

.options {
  display: flex;
  justify-content: space-between;
}

menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 1em;
  padding: 0;
  margin: 0;
}

.timestamp {
  display: flex;
  justify-content: flex-end;
  font-size: 0.9em;
  font-style: italic;
}

.base {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.base article:only-child {
  margin-left: auto;
}
.row {
  display: flex;
  justify-content: space-between;
  margin: 0;
  padding: 0
}
</style>
