<script setup lang="ts">
import router from "@/router";
import { defineEmits } from "vue";
import { useUserStore } from "../../stores/user";

const { currentUsername } = useUserStore();
const emit = defineEmits(["selection"]);

function updateRoute(newRoute: string) {
  router.push(newRoute);
  emit("selection");
}
</script>

<template>
  <aside class="nav-menu">
    <div class="column">
      <button class="nav-selection" @click="updateRoute('/tasks')">Tasks</button>
      <button class="nav-selection" @click="updateRoute('/messages')">Messages</button>
      <button class="nav-selection" @click="updateRoute('/friends')">Friends</button>
      <button class="nav-selection" @click="updateRoute('/challenges')">Challenges</button>
      <button class="nav-selection" @click="updateRoute('/kudos')">Kudos</button>
      <button class="nav-selection" @click="updateRoute(`/profile/${currentUsername}`)">Profile</button>
      <button class="nav-selection" @click="updateRoute('/settings')">Settings</button>
    </div>
  </aside>
</template>

<style scoped>
.nav-menu {
  position: fixed;
  left: 0;
  width: 25%;
  height: 100vh;
  background-color: var(--deep-purple);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  z-index: 1000; /* Ensure it's above other content */
  padding-top: 1em;
}

.column {
  width: 100%;
}

.nav-selection {
  width: 100%;
  background-color: transparent;
  border: none;
  color: white;
  font-size: 2.5vh;
  padding: 2vh;
  font-weight: 600;
  cursor: pointer;
}

.nav-selection:hover {
  background-color: var(--light-pink);
  color: white;
}
</style>
