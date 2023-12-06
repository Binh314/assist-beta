<script setup lang="ts">
import TaskFeed from "@/components/Task/TaskFeed.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main>
    <section>
      <div class="taskFeed">
        <h1>my tasks</h1>
        <TaskFeed :requestedTasks="true" />
        <div class="create" @click="$router.push({ name: 'Create' })">
          <span class="material-symbols-outlined" style="font-size: 2em">add_circle</span>
          <h3>Create New Task</h3>
        </div>
      </div>
      <div class="taskFeed">
        <h1>requests from friends <font-awesome-icon :icon="['fas', 'shuffle']" size="sm" class="icon" /></h1>
        <TaskFeed :requestedTasks="false" />
      </div>
    </section>
  </main>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: center;
}

h1 {
  margin-left: 0.5em;
  margin-top: 1em;
  display: flex;
  align-items: center;
}
.taskFeed {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin-left: 2.5em;
  margin-right: 2.5em;
}

.create {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 1em;
  margin: 1em 0.5em;
}

.create:hover {
  background-color: var(--light-pink);
}

.icon {
  margin-left: 0.5em;
  display: none;
}

.icon:hover {
  cursor: pointer;
}
</style>
