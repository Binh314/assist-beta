<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());

function login() {
  void router.push({ name: "Login" });
}

async function signup() {
  void router.push({ name: "Register" });
}
</script>

<template>
  <main>
    <section>
      <h1 v-if="isLoggedIn">Welcome {{ currentUsername }}!</h1>
      <div class="content" id="content-1">
        <img src="@/assets/images/homepage.png" />
        <div class="text">^ placeholder image; insert blurb that conveys value of using Assist</div>
        <a href="#content-2">
          <img class="icon" src="@/assets/images/scroll_down.png" />
        </a>
      </div>
      <div class="content" id="content-2">
        <img src="@/assets/images/homepage_help.png" />
        <div class="text">^ placeholder image; insert blurb that conveys value of using Assist</div>
        <a href="#content-3">
          <img class="icon" id="content-2-icon" src="@/assets/images/scroll_down.png" />
        </a>
      </div>
      <div class="content" id="content-3">
        <img src="@/assets/images/temp_logo.png" />
        <div>
          <button @click="signup">Sign up</button>
          <button @click="login">Login</button>
        </div>
        <a href="#top">
          <img class="icon" id="content-3-icon" src="@/assets/images/top_of_page.png" />
        </a>
      </div>
    </section>
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}

.content {
  display: block;
  padding-top: 2em;
  text-align: center;
  width: 100%;
  align-items: center;
  justify-content: center;
}

#content-2 {
  padding-top: 10em;
}

#content-2-icon {
  padding-top: 5em;
}

#content-3 {
  padding-top: 5em;
}

#content-3-icon {
  padding-top: 1em;
  padding-bottom: 2em;
}

img {
  max-width: 45%;
}

.text {
  margin-top: 0.5em;
  margin-left: 30%;
  width: 40%;
  text-align: center;
}

.icon {
  width: 5%;
}

.icon:hover {
  cursor: pointer;
}

button {
  margin-left: 2em;
  margin-right: 2em;
  margin-top: 1em;
}
</style>
