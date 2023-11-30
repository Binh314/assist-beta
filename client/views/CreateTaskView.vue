<script setup lang="ts">
import CreateTaskForm from "../components/Task/CreateTaskForm.vue";
</script>

<template>
  <main>
    <div class="content">
      <h1>Create Task</h1>
      <CreateTaskForm />
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
  width: 80%;
  margin-bottom: 3em;
}
</style>
