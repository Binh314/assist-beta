<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { formatDate, formatTaskDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["task"]);
const emit = defineEmits(["editTask", "refreshTasks"]);
const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());

const offeredHelp = computed(() => props.task.assisters.includes(currentUsername.value));
const tags = ref<Array<string>>([]);
const completing = ref(false);

const toggleComplete = async() => {
  completing.value = !completing.value;
}

const deleteTask = async () => {
  if (!confirm("Are you sure you want to delete this task?")) return;
  try {
    await fetchy(`/api/tasks/${props.task._id}`, "DELETE");
  } catch {
    return;
  }
  emit("refreshTasks");
};

const offerHelp = async () => {
  if (!offeredHelp.value)
    try {
      await fetchy(`/api/tasks/${props.task._id}/help/offer`, "PATCH");
    } catch (_) {
      return;
    }
  emit("refreshTasks");
};

const retractHelp = async () => {
  if (offeredHelp.value)
    try {
      await fetchy(`/api/tasks/${props.task._id}/help/retract`, "PATCH");
    } catch (_) {
      return;
    }
  emit("refreshTasks");
};

onBeforeMount(async () => {
  let tagResults;
  try {
    tagResults = await fetchy(`/api/tag/item/${props.task._id}`, "GET");
  } catch {
    return;
  }
  tags.value = tagResults.map((e: Record<string, string>) => e.name);
});
</script>

<template>
  <h3 class="Requester">{{ props.task.requester }}</h3>
  <h2 class="title">{{ props.task.title }}</h2>

  <p class="time"><font-awesome-icon :icon="['fas', 'clock']" class="icon" size="lg" /> {{ formatTaskDate(props.task.deadline) }}</p>

  <p id="tags" class="tags" v-if="tags.length > 0"><font-awesome-icon icon="tags" size="lg" class="icon" /> {{ tags.join(", ") }}</p>

  <h3 id="assisters" class="assisters" v-if="props.task.requester == currentUsername && props.task.assisters.length > 0">
    <br />
    <font-awesome-icon :icon="['fas', 'handshake']" size="2xl" class="icon" /> {{ props.task.assisters.join(", ") }}
  </h3>

  <label for="description" v-if="task.description"><b>Description</b></label>
  <p class="description" v-if="task.description">{{ props.task.description }}</p>

  <br />
  <div v-if="props.task.requester == currentUsername">
    <menu class="options">
      <li><button class="btn-small pure-button" @click="emit('editTask', props.task._id)">Edit</button></li>
      <li><button class="button-error btn-small pure-button" @click="deleteTask">Delete</button></li>
    </menu>
    <br>
    <button class="pure-button pure-button-primary" @click="toggleComplete"> Mark Completed </button>
  </div>
  <div v-else-if="isLoggedIn">
    <div class="addTask">
      <button v-if="!offeredHelp" class="pure-button pure-button-primary" @click="offerHelp">Offer Help!</button>
      <button v-else class="pure-button button-error" @click="retractHelp">Retract Help Offer</button>
    </div>
  </div>
  <div class="timestamp">
    <p v-if="props.task.dateCreated !== props.task.dateUpdated">Edited on: {{ formatDate(props.task.dateUpdated) }}</p>
    <p v-else>Created on: {{ formatDate(props.task.dateCreated) }}</p>
  </div>
  <div v-if="completing" class="modal-overlay">
        <div class = "modal-content">
            <button @click="toggleComplete" class = "exit-btn">X</button>
                <h1>Who helped you?</h1>
            <div class="content">

            </div>
        </div>
    </div>
</template>

<style scoped>
label {
  padding-top: 1em;
}
.icon {
  width: 1em;
}
.dropdownButton {
  width: 10em;
}

.host {
  font-weight: normal;
}

h2,
h3 {
  margin-top: 0;
  margin-bottom: 0;
}
p {
  margin: 0em;
}

.photo {
  height: 50vh;
  max-width: 100%;
  border-radius: 1em;
  object-fit: scale-down;
}

.title {
  font-weight: bold;
}

.options {
  display: flex;
  justify-content: space-between;
}

menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 1em;
  padding: 0;
  margin: 0;
}

.timestamp {
  display: flex;
  justify-content: flex-end;
  font-size: 0.9em;
  font-style: italic;
}

.base {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.base article:only-child {
  margin-left: auto;
}
</style>
