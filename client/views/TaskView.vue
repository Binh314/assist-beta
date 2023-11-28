<script setup lang="ts">
import createTaskForm from "@/components/Task/CreateTaskForm.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main>
    <section>
      <h1 v-if="isLoggedIn">Welcome {{ currentUsername }}!</h1>
      <createTaskForm/>
      <!-- <div class="content">
        <img src="@/assets/images/temp_logo.png" />
        <div class="text">^ placeholder image (replace with screenshot of part of app or maybe storyboard to give a sense of how the app works); insert blurb on aims of Assist</div>
        <img class="icon" src="@/assets/images/scroll_down.png" />
      </div> -->
    </section>
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}

.content {
  display: block;
  margin-top: 3em;
  text-align: center;
  width: 100%;
  align-items: center;
  justify-content: center;
}

img {
  max-width: 40%;
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
</style>
