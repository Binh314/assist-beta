<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { ref } from "vue";

const username = ref("");
const password = ref("");
const { loginUser, updateSession } = useUserStore();

async function login() {
  await loginUser(username.value, password.value);
  void updateSession();
  void router.push({ name: "Home" });
}
</script>

<template>
  <div class="login-form">
    <form class="pure-form pure-form-aligned" @submit.prevent="login">
      <h1>Login</h1>
      <fieldset class="column">
        <div class="pure-control-group">
          <input class="one-line-input" v-model.trim="username" type="text" id="aligned-name" placeholder="Username" required />
        </div>
        <div class="pure-control-group">
          <input class="one-line-input" type="password" v-model.trim="password" id="aligned-password" placeholder="Password" required />
        </div>
        <a>Don't have an account? <a href="/register" class="link">Sign up here!</a></a>
        <button type="submit" class="primary-button">Go!</button>
      </fieldset>
    </form>
  </div>
</template>

<style scoped>
.login-form {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh; /* This makes the container take the full height of the viewport */
}

form {
  width: 100%; /* Adjust based on your preference */
  max-width: 400px; /* Sets a maximum width for the form */
}

h1 {
  display: flex;
  justify-content: center;
  font-size: 4vh;
}
</style>
