<script setup lang="ts">
import EditTaskForm from "@/components/Task/EditTaskForm.vue";
import TaskComponent from "@/components/Task/TaskComponent.vue";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";

const { isLoggedIn, currentUsername } = storeToRefs(useUserStore());
const props = defineProps(["requestedTasks"]);

const loaded = ref(false);
let tasks = ref<Array<Record<string, string>>>([]);
let editing = ref("");
let searchRequester = ref("");
const componentKey = ref(1);

// to be implemented after task match is implemented. rn just calls getTasks
async function getMatchedTasks(host?: string) {
  return getTasks();
}

async function getTasks(requester?: string) {
  let query: Record<string, string> = requester !== undefined ? { requester } : {};
  let taskResults;
  try {
    if (props.requestedTasks) {
      taskResults = await fetchy("/api/tasks/requested", "GET");
    } else {
      taskResults = await fetchy("/api/tasks/matched", "GET");
    }
  } catch (_) {
    return;
  }
  searchRequester.value = requester ? requester : "";
  tasks.value = taskResults;
}

function updateEditing(id: string) {
  editing.value = id;
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
  <div>
    <section class="tasks" v-if="loaded && tasks.length !== 0">
      <div v-for="task in tasks" :key="task._id">
        <article :class="`${(!props.requestedTasks && task.matched) ? 'matchedTask' : ''}`">
          <TaskComponent v-if="editing !== task._id" :task="task" @refreshTasks="getMatchedTasks" @editTask="updateEditing" />
          <EditTaskForm v-else :task="task" @refreshTasks="getMatchedTasks" @editTask="updateEditing" />
        </article>
      </div>
    </section>
    <p v-else-if="loaded">No tasks found</p>
    <p v-else>Loading...</p>
  </div>
</template>

<style scoped>

.matchedTask {
  border-style: solid;
  background-color: var(--light-pink);
}

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

p {
  width: 35em;
  padding-left: 1em;
}

article {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
  width: 35em;
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
  padding: 1em;
}
</style>
