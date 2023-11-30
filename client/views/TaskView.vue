<script setup lang="ts">
import TaskFeed from "@/components/Task/TaskFeed.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main>
    <section>
      <TaskFeed />
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
