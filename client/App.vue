<script setup lang="ts">
import { useToastStore } from "@/stores/toast";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount, ref } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";
import NavMenu from "./components/Navigation/NavMenu.vue";

const currentRoute = useRoute();
const currentRouteName = computed(() => currentRoute.name);
const userStore = useUserStore();
const { isLoggedIn, currentUsername, currentProfilePicture } = storeToRefs(userStore);
const { toast } = storeToRefs(useToastStore());
const displayMenu = ref(false);

// Make sure to update the session before mounting the app in case the user is already logged in
onBeforeMount(async () => {
  try {
    await userStore.updateSession();
  } catch {
    // User is not logged in
  }
});

function controlMenu() {
  displayMenu.value = !displayMenu.value;
  console.log("trying to control menu: ", displayMenu.value);
}
</script>

<template>
  <header>
    <nav class="navigation">
      <div class="title">
        <img src="@/assets/images/temp_logo.png" />
        <RouterLink :to="{ name: 'Home' }">
          <h1>Assist</h1>
        </RouterLink>
      </div>
      <button class="expand" @click="controlMenu">
        <img class="expand-img" src="@/assets/images/scroll_down.png" />
      </button>
    </nav>

    <article v-if="toast !== null" class="toast" :class="toast.style">
      <p>{{ toast.message }}</p>
    </article>
  </header>
  <div v-if="currentRouteName !== 'Create' && isLoggedIn" class="corner">
    <RouterLink :to="{ name: 'Create' }">
      <img class="icon" src="@/assets/images/create.png" />
    </RouterLink>
  </div>
  <NavMenu v-if="displayMenu" @selection="controlMenu" />
  <RouterView :key="$route.fullPath" />
</template>

<style scoped>
.navigation {
  height: 7vh;
}

@import "./assets/toast.css";
.expand {
  background-color: transparent;
  border: none;
  padding-left: 38%;
}

.expand-img {
  object-fit: cover; /* Ensures the image covers the area without distorting */
  height: 5vh; /* Adjust this value as needed */
  width: 20vh; /* Make width equal to height for a perfect circle */
  overflow: hidden; /* This will clip the corners of the image */
}

.corner {
  position: fixed;
  bottom: 0.75em;
  right: 0.5em;
}

.icon {
  height: 3em;
}

nav {
  /* padding: 1em 2em; */
  background-color: var(--dark-purple);
  display: flex;
  align-items: center;
}

h1 {
  font-size: 2em;
  margin: 0;
}

.title {
  display: flex;
  align-items: center;
  gap: 0.5em;
}

img {
  height: 2em;
}

a {
  font-size: large;
  color: white;
  text-decoration: none;
}

ul {
  list-style-type: none;
  margin-left: auto;
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 1em;
}

.underline {
  text-decoration: underline;
}
</style>
