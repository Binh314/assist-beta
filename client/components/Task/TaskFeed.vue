<script setup lang="ts">
import createTaskForm from "@/components/Task/CreateTaskForm.vue";
import EditTaskForm from "@/components/Task/EditTaskForm.vue";
import TaskComponent from "@/components/Task/TaskComponent.vue";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";

const { isLoggedIn } = storeToRefs(useUserStore());

const loaded = ref(false);
let tasks = ref<Array<Record<string, string>>>([]);
let editing = ref("");
let searchHost = ref("");
let creating = ref(false);
const componentKey = ref(1);

// to be implemented after task match is implemented. rn just calls getTasks
async function getMatchedTasks(host?: string) {
  return getTasks();
}

async function getTasks(host?: string) {
  let query: Record<string, string> = host !== undefined ? { host } : {};
  let taskResults;
  try {
    taskResults = await fetchy("/api/tasks", "GET", { query })
  } catch (_) {
    return;
  }
  searchHost.value = host ? host : "";
  tasks.value = taskResults;
  creating.value = false;
}

function updateEditing(id: string) {
  editing.value = id;
}



function createTask() {
  creating.value = true;
}

onBeforeMount(async () => {
  if (isLoggedIn) {
    await getMatchedTasks();
  } else {
    await getTasks();
  }
  loaded.value = true;
});
</script>

<template>

  <div v-if="creating">
    <section class="formArea" v-if="isLoggedIn">
        <h2>Create a task:</h2>
        <createTaskForm @refreshTasks="getTasks" />
    </section>
  </div>
  <div v-else>
    <div class="row">
      <button @click="createTask" class="pure-button pure-button-primary" >Create a Task</button>
    </div>
    <section class="tasks" v-if="loaded && tasks.length !== 0">
      <article v-for="task in tasks" :key="task._id">
        <TaskComponent v-if="editing !== task._id" :task="task" @refreshTasks="getMatchedTasks"
        @editTask="updateEditing"/>
        <EditTaskForm v-else :task="task" @refreshTasks="getMatchedTasks" @editTask="updateEditing" />
      </article>
    </section>
    <p v-else-if="loaded">No tasks found</p>
    <p v-else>Loading...</p>
  </div>

</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

section,
p,
.row {
  margin: 0 auto;
  /* max-width: 60em; */
}

article {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

.tasks {
  padding: 1em;
}

.formArea {
  padding: 1em;
}

.row {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  padding: 1em
}
</style>
