<script setup lang="ts">
import TaskComponent from "@/components/Task/TaskComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../utils/fetchy";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
const props = defineProps(["id"]);
let task = ref<Record<string, string>>();

const loaded = ref(false);
let tasks = ref<Array<Record<string, string>>>([]);
let editing = ref("");
let searchRequester = ref("");

onBeforeMount(async () => {
  await getTask();
})


async function getTask() {
  loaded.value = false;
  try {
    task.value = await fetchy(`/api/tasks/id/${props.id}`, "GET");
  } catch(_) {
    return;
  }
  loaded.value = true;
}


function updateEditing(id: string) {
  editing.value = id;
}

</script>

<template>
  <div>
    <section class="task" v-if="loaded">
      <div v-if="task">
        <article>
          <TaskComponent v-if="editing !== task._id" :task="task" @refreshTasks="getTask" @editTask="updateEditing" />
          <EditTaskForm v-else :task="task" @refreshTasks="getTask" @editTask="updateEditing" />
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

.helpTask {
  background-color: var(--blue-gray);
}

.matchedHelpTask {
  background-color: var(--blue-gray);
  border-style: solid;
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

.task {
  padding: 1em;
  display: flex;
  align-items: center;
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

