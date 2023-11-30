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
        <TaskFeed />
      </div>
      <div class="taskFeed">
        <h1>requests from friends <font-awesome-icon :icon="['fas', 'shuffle']" size="sm" class="icon" /></h1>
        <TaskFeed />
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
.taskfeed {
  display: flex;
  flex-direction: column;
}

.icon {
  margin-left: 0.5em;
}

.icon:hover {
  cursor: pointer;
}
</style>
