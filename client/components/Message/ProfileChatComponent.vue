<script setup lang="ts">

import router from "@/router";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { useRoute, } from "vue-router";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());

const currentRoute = useRoute();
const props = defineProps(["username"]);

const navColor = ref("#F98A1D");

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

async function goToProfile() {
  void router.push(`/profile/${props.username}`);
}

onBeforeMount(async () => {
  await getProfile();
});
</script>

<template>
  <div class="header" @click="goToProfile">
    <div class="container">
      <img v-if="profile.picture" :src="profile.picture"/>
      <img v-else src="@/assets/images/user-solid.png"/>
      <h2 class="name"> {{ profile.username }} </h2>
    </div>
  </div>
</template>

<style scoped>


.header:hover {
  cursor: pointer;
  text-decoration: underline;
}

.header {
  background-color: var(--purple);
  border-bottom: solid;
  border-radius: 1em;
}

.container {
  display: flex;
  align-items: center;
}

.username {
  font-size: smaller
}

.name {
  font-weight: bold;
}

img {
  object-fit: cover;
  height: 2em;
  aspect-ratio: 1;
  margin: 1em 1em;
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
.icon {
  width: 1em;
}
.dropdownButton {
  width: 10em;
}

.host {
  font-weight: normal;
}

h2, h3 {
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
