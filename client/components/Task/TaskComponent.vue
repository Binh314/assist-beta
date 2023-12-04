<script setup lang="ts">
import router from "@/router";
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
const assisterIndex = ref(props.task.assisters.length);
let profile = ref<Record<string, string>>({});

const toggleComplete = async() => {
  completing.value = !completing.value;
  assisterIndex.value = props.task.assisters.length;
}

async function goToMessages() {
  void router.push(`/messages/${props.task.requester}`);
}

async function goToProfile() {
  void router.push(`/profile/${props.task.requester}`);
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

const markAssister = async(index: number) => {
  assisterIndex.value = index;
}

const completeTask = async () => {
  try {
    const assister = (assisterIndex.value !== props.task.assisters.length) ? 
      props.task.assisters[assisterIndex.value] : null;

    await fetchy(`/api/tasks/${props.task._id}/complete`, "PATCH",
      { body : {
        assister: assister
      }
    });
  } catch (_) {
    return;
  }
  emit("refreshTasks");
}

async function getProfile() {
  let profileResult;
  try {
    profileResult = await fetchy(`/api/users/${props.task.requester}`, "GET")
  } catch (_) {
    return;
  }
  profile.value = profileResult;
}

onBeforeMount(async () => {
  let tagResults;
  try {
    tagResults = await fetchy(`/api/tag/item/${props.task._id}`, "GET");
  } catch {
    return;
  }
  tags.value = tagResults.map((e: Record<string, string>) => e.name);
  await getProfile();
});
</script>

<template>
  <h2 class="requester">
    <img v-if="profile.picture" :src="profile.picture" @click.stop="goToProfile"/>
    <span class="profile"  @click.stop="goToProfile">
      <span class="name"> 
        <!-- <img v-if="profile.picture" :src="profile.picture"/> -->
        {{ props.task.requester }} 
      </span>
    </span>
    <font-awesome-icon v-if="$props.task.requester !== currentUsername && isLoggedIn"
    class="icon messageIcon" :icon="['far', 'envelope']" size="lg" @click.stop="goToMessages"/>
  </h2>
  <br>
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
      <li><button v-if="!props.task.completed" class="btn-small pure-button" @click="emit('editTask', props.task._id)">Edit</button></li>
      <li><button class="button-error btn-small pure-button" @click="deleteTask">Delete</button></li>
    </menu>
    <br>
    <button class="pure-button pure-button-primary" @click="toggleComplete"> Mark Completed </button>
  </div>
  <div v-else-if="isLoggedIn" v-if="!props.task.completed">
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
          <span v-for="(assister, index) in props.task.assisters.concat('I resolved it myself!')" :key="index">
            <button :class="`pure-button assisterButton ${(index === assisterIndex) ? 'selectedAssistant' : 'unselectedAssistant'}`" @click="markAssister(index)">
              {{ assister }}
            </button>
          </span>
        </div>
        <br>
        <br>
        <menu class="options">
          <li><button class="pure-button pure-button-primary" @click="completeTask">Mark Completed</button></li>
          <li><button class="button-error btn-small pure-button" @click="toggleComplete">Cancel</button></li>
        </menu>
    </div>
  </div>
</template>

<style scoped>
.requester {
  display: flex;
  flex-direction: row;
  align-items: center;
}

img {
  object-fit: cover;
  height: 2em;
  aspect-ratio: 1;
  margin-right: 0.5em;
  cursor:pointer;
  border-radius: 1em;
}

.profile:hover {
  cursor: pointer;
  text-decoration: underline;
}

.clickable:hover {
  cursor: pointer;
}

.selectedAssistant {
  font-weight: bold;

}

.assisterButton {
  margin-right: 1em;
}

label {
  padding-top: 1em;
}
.icon {
  width: 1em;
}

.messageIcon {
  margin-left: 0.5em;
}

.messageIcon:hover {
  cursor: pointer;
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
