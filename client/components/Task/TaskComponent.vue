<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { formatTaskDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["task"]);
const emit = defineEmits(["editTask", "refreshTasks"]);
const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
const kudosMessage = ref("");

const offeredHelp = computed(() => props.task.assisters.includes(currentUsername.value));
const tags = ref<Array<string>>([]);
const completing = ref(false);
const kudosAsk = ref(false);
const sendingKudos = ref(false);
const assisterIndex = ref(props.task.assisters.length);
let profile = ref<Record<string, string>>({});

const isOfferVisible = ref(false);
const isRetractVisible = ref(false);
const isDeleteVisible = ref(false);

const toggleComplete = async () => {
  completing.value = !completing.value;
  assisterIndex.value = props.task.assisters.length;
};

const toggleSend = () => {
  kudosAsk.value = !kudosAsk.value;
  emit("refreshTasks");
};

async function goToMessages(user: string) {
  void router.push(`/messages/${user}`);
}

async function goToProfile() {
  void router.push(`/profile/${props.task.requester}`);
}

const deleteTask = async () => {
  try {
    await fetchy(`/api/tasks/${props.task._id}`, "DELETE");
  } catch {
    return;
  }
  closeDeleteModal();
  emit("refreshTasks");
};

const offerHelp = async () => {
  if (!offeredHelp.value)
    try {
      await fetchy(`/api/tasks/${props.task._id}/help/offer`, "PATCH", { alert: false });
    } catch (_) {
      return;
    }
  closeOfferModal();
  emit("refreshTasks");
};

const retractHelp = async () => {
  if (offeredHelp.value)
    try {
      await fetchy(`/api/tasks/${props.task._id}/help/retract`, "PATCH", { alert: false });
    } catch (_) {
      return;
    }
  closeRetractModal();
  emit("refreshTasks");
};

const markAssister = async (index: number) => {
  assisterIndex.value = index;
};

const completeTask = async () => {
  try {
    const assister = assisterIndex.value !== props.task.assisters.length ? props.task.assisters[assisterIndex.value] : null;

    await fetchy(`/api/tasks/${props.task._id}/complete`, "PATCH", {
      body: {
        assister: assister,
      },
    });

    if (assister) {
      completing.value = false;
      kudosAsk.value = true;
    } else {
      emit("refreshTasks");
    }
  } catch (_) {
    return;
  }
};

function sendKudos() {
  kudosAsk.value = false;
  sendingKudos.value = true;
}

async function sendMessage() {
  try {
    const assister = assisterIndex.value !== props.task.assisters.length ? props.task.assisters[assisterIndex.value] : null;
    const assisterId = await fetchy(`/api/users/${assister}`, "GET");
    await fetchy(`/api/kudo`, "POST", {
      body: {
        receiver: assisterId._id,
        task: props.task._id,
        message: kudosMessage.value,
      },
    });
  } catch (_) {
    return;
  }
  sendingKudos.value = false;
  emit("refreshTasks");
}

async function getProfile() {
  let profileResult;
  try {
    profileResult = await fetchy(`/api/users/${props.task.requester}`, "GET");
  } catch (_) {
    return;
  }
  profile.value = profileResult;
}

const closeOfferModal = () => {
  isOfferVisible.value = false;
};

const openHelpModal = () => {
  isOfferVisible.value = true;
};

const closeRetractModal = () => {
  isRetractVisible.value = false;
};

const openRetractModal = () => {
  isRetractVisible.value = true;
};

const closeDeleteModal = () => {
  isDeleteVisible.value = false;
};

const openDeleteModal = () => {
  isDeleteVisible.value = true;
};

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
    <img v-if="profile.picture" :src="profile.picture" @click.stop="goToProfile" />
    <span class="profile" @click.stop="goToProfile">
      <span class="name">
        <!-- <img v-if="profile.picture" :src="profile.picture"/> -->
        {{ props.task.requester }}
      </span>
    </span>
    <font-awesome-icon v-if="$props.task.requester !== currentUsername && isLoggedIn" class="icon messageIcon" :icon="['far', 'envelope']" size="lg" @click.stop="goToMessages(props.task.requester)" />
  </h2>
  <br />
  <h2 class="title">{{ props.task.title }}</h2>

  <p class="time"><font-awesome-icon :icon="['fas', 'clock']" class="icon" size="lg" />&nbsp; {{ formatTaskDate(props.task.deadline) }}</p>

  <p id="tags" class="tags" v-if="tags.length > 0"><font-awesome-icon icon="tags" size="lg" class="icon" />&nbsp; {{ tags.join(", ") }}</p>

  <label for="description" v-if="task.description"><b>Description</b></label>
  <p class="description" v-if="task.description">{{ props.task.description }}</p>

  <p id="assisters" class="assisters" v-if="props.task.requester == currentUsername && props.task.assisters.length > 0">
    <br />
    <font-awesome-icon :icon="['fas', 'handshake']" size="2xl" class="icon assistIcon" />
    <span v-for="(assister, index) in props.task.assisters">
      <span class="assister" @click="goToMessages(assister)">
        <font-awesome-icon class="icon" :icon="['far', 'envelope']" size="lg" />
        {{ assister }}
      </span>
      <span v-if="index + 1 < props.task.assisters.length">, </span>
    </span>
  </p>
  <br />

  <h2 class="completed" v-if="task.completed"><font-awesome-icon :icon="['fas', 'square-check']" size="lg" class="icon" /> This task has been completed.</h2>

  <div v-if="props.task.requester == currentUsername && !task.completed" class="requesterOptions">
    <button class="pure-button pure-button-primary" @click="toggleComplete">Mark Completed</button>
    <menu class="editOptions">
      <li><button v-if="!props.task.completed" class="btn-small pure-button" @click="emit('editTask', props.task._id)">Edit</button></li>
      <li><button class="button-error btn-small pure-button" @click="openDeleteModal">Delete</button></li>
    </menu>
  </div>
  <div v-else-if="isLoggedIn" v-if="!props.task.completed">
    <div class="addTask">
      <button v-if="!offeredHelp" class="pure-button pure-button-primary" @click="openHelpModal">Offer Help!</button>
      <button v-else class="pure-button redButton" @click="openRetractModal">Retract Help Offer</button>
    </div>
  </div>
  <!-- <div class="timestamp">
    <p v-if="props.task.dateCreated !== props.task.dateUpdated">Edited on: {{ formatDate(props.task.dateUpdated) }}</p>
    <p v-else>Created on: {{ formatDate(props.task.dateCreated) }}</p>
  </div> -->
  <div v-if="completing" class="modal-overlay">
    <div class="modal-content">
      <h1>Who helped you?</h1>
      <div class="content">
        <span v-for="(assister, index) in props.task.assisters.concat('I resolved it myself!')" :key="index">
          <button :class="`pure-button assisterButton ${index === assisterIndex ? 'selectedAssistant' : 'unselectedAssistant'}`" @click="markAssister(index)">
            {{ assister }}
          </button>
        </span>
      </div>
      <br />
      <br />
      <menu class="confirmOptions">
        <li><button class="pure-button pure-button-primary" @click="completeTask">Mark Completed</button></li>
        <li><button class="button-error pure-button" @click="toggleComplete">Cancel</button></li>
      </menu>
    </div>
  </div>
  <div v-if="kudosAsk" class="modal-overlay">
    <div class="modal-content">
      <h1>Do you want to send kudos to {{ $props.task.assisters[assisterIndex] }}?</h1>
      <menu class="confirmOptions">
        <li><button class="pure-button pure-button-primary" @click="sendKudos">Yes</button></li>
        <li><button class="button-error pure-button" @click="toggleSend">No</button></li>
      </menu>
    </div>
  </div>
  <div v-if="sendingKudos" class="modal-overlay">
    <div class="modal-content">
      <h1>Compose a message to accompany your kudos!</h1>
      <menu class="options">
        <form class="pure-form pure-form-aligned" @submit.prevent="sendMessage">
          <h3>Message</h3>
          <div class="pure-control-group">
            <input class="long-input" v-model="kudosMessage" id="aligned-name" placeholder="message" required />
          </div>
          <button type="submit" class="primary-button">send kudos!</button>
        </form>
      </menu>
    </div>
  </div>
  <div v-if="isOfferVisible" class="modal-overlay">
    <div class="modal-content confirmMenu">
      <div class="taskDesc">
        <h1>Are you sure you want to help {{ props.task.requester }}?</h1>
        <h2 class="title">{{ props.task.title }}</h2>
        <p class="time"><font-awesome-icon :icon="['fas', 'clock']" class="icon" size="lg" /> {{ formatTaskDate(props.task.deadline) }}</p>
        <p id="tags" class="tags" v-if="tags.length > 0"><font-awesome-icon icon="tags" size="lg" class="icon" /> {{ tags.join(", ") }}</p>
        <label for="description" v-if="task.description"><b>Description</b></label>
        <p class="description" v-if="task.description">{{ props.task.description }}</p>
      </div>
      <menu class="confirmOptions">
        <button @click="offerHelp" class="pure-button-primary pure-button">Offer Help!</button>
        <button @click="closeOfferModal" class="pure-button button-error">Cancel</button>
      </menu>
    </div>
  </div>
  <div v-if="isRetractVisible" class="modal-overlay">
    <div class="modal-content confirmMenu">
      <div class="taskDesc">
        <h1>Are you sure you want to retract your help for task?</h1>
        <h2 class="title">{{ props.task.title }}</h2>
        <p class="time"><font-awesome-icon :icon="['fas', 'clock']" class="icon" size="lg" /> {{ formatTaskDate(props.task.deadline) }}</p>
        <p id="tags" class="tags" v-if="tags.length > 0"><font-awesome-icon icon="tags" size="lg" class="icon" /> {{ tags.join(", ") }}</p>
        <label for="description" v-if="task.description"><b>Description</b></label>
        <p class="description" v-if="task.description">{{ props.task.description }}</p>
      </div>
      <menu class="confirmOptions">
        <button @click="retractHelp" class="pure-button redButton">Retract Help Offer</button>
        <button @click="closeRetractModal" class="pure-button button-error">Cancel</button>
      </menu>
    </div>
  </div>
  <div v-if="isDeleteVisible" class="modal-overlay">
    <div class="modal-content confirmMenu">
      <div class="taskDesc">
        <h1>Are you sure you want to delete this task?</h1>
        <h2 class="title">{{ props.task.title }}</h2>
        <p class="time"><font-awesome-icon :icon="['fas', 'clock']" class="icon" size="lg" /> {{ formatTaskDate(props.task.deadline) }}</p>
        <p id="tags" class="tags" v-if="tags.length > 0"><font-awesome-icon icon="tags" size="lg" class="icon" /> {{ tags.join(", ") }}</p>
        <label for="description" v-if="task.description"><b>Description</b></label>
        <p class="description" v-if="task.description">{{ props.task.description }}</p>
      </div>
      <menu class="confirmOptions">
        <button @click="deleteTask" class="pure-button redButton">Delete Task</button>
        <button @click="closeDeleteModal" class="pure-button button-error">Cancel</button>
      </menu>
    </div>
  </div>
</template>

<style scoped>
.redButton {
  background-color: var(--red) !important;
}
.assisters {
  font-size: x-large;
}
.assister:hover {
  cursor: pointer;
  text-decoration: underline;
}

.assister {
  margin-left: 0.5em;
}

.assistIcon {
  margin-right: 0.25em;
}

.taskDesc {
  line-height: 2em;
}
.confirmOptions {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}

.long-input {
  width: 40em;
  height: 3em;
  margin-top: 1em;
  margin-bottom: 1em;
  padding-left: 1em;
}

.confirmMenu {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

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
  cursor: pointer;
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

.unselectedAssistant {
  background-color: lightgray !important;
  color: black !important;
}

.unselectedAssistant:hover {
  background-color: gray !important;
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

.editOptions {
  display: flex;
  justify-content: flex-end;
}

.requesterOptions {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
