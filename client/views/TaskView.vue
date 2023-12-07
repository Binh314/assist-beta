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
        <h1>
          My Tasks
          <div class="create" @click="$router.push({ name: 'Create' })">
            <span class="material-symbols-outlined" style="font-size: 1em">add_circle</span>
          </div>
        </h1>
        <TaskFeed :requestedTasks="true" />
      </div>
      <div class="taskFeed">
        <h1>Requests from Friends <font-awesome-icon :icon="['fas', 'shuffle']" size="sm" class="icon" /></h1>
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
  margin-left: 0.25em;
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
