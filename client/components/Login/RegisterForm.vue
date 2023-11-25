<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { ref } from "vue";

const username = ref("");
const password = ref("");
const { createUser, loginUser, updateSession } = useUserStore();

async function register() {
  await createUser(username.value, password.value);
  await loginUser(username.value, password.value);
  void updateSession();
  void router.push({ name: "Home" });
}
</script>

<template>
  <div class = "register-form">
    <form class="pure-form pure-form-aligned" @submit.prevent="register">
    <h1>Register User</h1>
    <fieldset class = "column">
      <div class="pure-control-group">
        <input  class = "one-line-input" v-model.trim="username" type="text" id="aligned-name" placeholder="Username" required />
      </div>
      <div class="pure-control-group">
        <input  class = "one-line-input"  type="password" v-model.trim="password" id="aligned-password" placeholder="Password" required />
      </div>
      <button type="submit" class = "primary-button">Register</button>
    
    </fieldset>
  </form>
  </div>
  
</template>

<style scoped>
.register-form {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh; /* This makes the container take the full height of the viewport */
}

form{
  width: 100%; /* Adjust based on your preference */
  max-width: 400px; /* Sets a maximum width for the form */
}

h1 {
  display: flex;
  justify-content: center;
  font-size: 4vh;
}

</style>
