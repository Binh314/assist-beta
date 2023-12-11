<script setup lang="ts">
import router from "@/router";
import CreateTaskForm from "../components/Task/CreateTaskForm.vue";

const goToTasks = async () => {
  router.push({name: "Task"})
}

</script>

<template>
  <main>
    <div class="content">
      <h1>Create Task</h1>
      <CreateTaskForm @refreshTasks="goToTasks"/>
    </div>
  </main>
</template>

<style scoped>
main {
  display: flex;
  justify-content: center;
}

h1 {
  margin-top: 1em;
  text-align: center;
}

.content {
  width: 50%;
  margin-bottom: 3em;
}
</style>
