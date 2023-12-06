<script setup lang="ts">
import router from "@/router";
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
const { logoutUser } = useUserStore();

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

function showMenu() {
  displayMenu.value = true;
}

function hideMenu() {
  displayMenu.value = false;
}

async function logout() {
  await logoutUser();
  void router.push({ name: "Home" });
}
</script>

<template>
  <header>
    <nav class="navigation">
      <button v-if="isLoggedIn" class="expand" @click = "controlMenu">
        <img class="expand-img" src="@/assets/images/hamburger_white.png" />
      </button>
      <div class="title">
        <RouterLink :to="{ name: 'Home' }" class="title">
          <img src="@/assets/images/temp_logo.png" />
          <h1>Assist</h1>
        </RouterLink>
      </div>
      
      <ul>
        <li v-if="isLoggedIn" @click="logout">
          <p class="button">Logout</p>
        </li>
        <!-- <li v-else>
          <RouterLink v-if="currentRouteName !== 'Login'" :to="{ name: 'Login' }" :class="{ underline: currentRouteName == 'Login' }"> Login </RouterLink>
        </li> -->
      </ul>
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
  <RouterView :key="$route.fullPath" @click="hideMenu"/>
</template>

<style scoped>
@import "./assets/toast.css";
.navigation {
  height: 7vh;
  padding-left: 1em;
  padding-right: 1em;
  padding-top: 0.5em;
  padding-bottom: 0.5em;
}
.expand {
  background-color: transparent;
  border: none;
  padding: 1%;
}

.expand-img {
  object-fit: cover; /* Ensures the image covers the area without distorting */
  height: 5vh; /* Adjust this value as needed */
  width: 5vh; /* Make width equal to height for a perfect circle */
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

.button {
  color: white;
  font-size: 1.25em;
}

.button:hover {
  cursor: pointer;
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
  height: 7vh;
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
