<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, onBeforeUnmount, ref, watch } from "vue";
import router from "../../router";
import MessageComponent from "./MessageComponent.vue";
import MessageListComponent from "./MessageListComponent.vue";
import MessageNewComponent from "./MessageNewComponent.vue";

const { isLoggedIn, currentUsername } = storeToRefs(useUserStore());

// const currentRoute = ref(useRoute());
// const currentRouteName = computed(() => currentRoute.value.name);

let messages = ref<Array<Record<string, string>>>([]);

const loaded = ref(false);
const componentKey = ref(1);
let profile = ref<Record<string, string>>();
let editing = ref("");
const username = ref("");
const interval = ref();
const expanded = ref(false);

const messaging = ref<Array<string>>();

// setInterval(getMessages, 1000);

function expandChat() {
  expanded.value = true;
}

function minimizeChat() {
  expanded.value = false;
}

async function refreshList() {
  await getMessages();
}

async function getMessages() {
  let messageResults;
  try {
    messageResults = await fetchy("/api/message/all", "GET")
  } catch (_) {
    return;
  }
  messages.value = messageResults;
  const u = messages.value.map(message => 
    (message.from === currentUsername.value) ? message.to : message.from
  );
  const usernames = [... new Set(u)];
  let sameNames = usernames.length === messaging.value?.length;
  for (let i = 0; i < usernames.length; i++) {
    if (messaging === undefined) {sameNames = false; break;}
    if (messaging.value === undefined) {sameNames = false; break;}
    if (usernames[i] !== messaging.value[i]) {
      sameNames = false;
      break;
    }
  }
  if (!sameNames) {
    messaging.value = [];
    setTimeout(() => {
      messaging.value = usernames;
    }, 50);
  }
}


async function newMessage() {
  void router.push({ name: "Messages"});
}
  
watch(async () => router.currentRoute.value.params.username, 
  async name => { 
    loaded.value = false;
    const user = await name;
    if (typeof user === "string") 
      username.value = user;
    else username.value = ""
    await getMessages();
  }
);

async function updateLoad() {
  loaded.value = true;
}

function updateEditing(id: string) {
  editing.value = id;
}

onBeforeMount(async () => {
  const user = router.currentRoute.value.params.username;
  if (typeof user === "string")
    username.value = user;
  await getMessages();
  interval.value = setInterval(refreshList, 1000);
  loaded.value = true;
});

onBeforeUnmount(async () => {
  clearInterval(interval.value);
})


</script>

<template>
  <div class="pure-grid page">
    <div class="pure-u-1-4">
      <div class=" messageList">
        <h1>Messages</h1>
        <div class="list">
          <button v-if="username" class="pure-button pure-button-primary newMessage" @click="newMessage">New Message</button>
          <MessageListComponent :messaging="messaging" @sendMessage="refreshList"/>
        </div>
      </div>
    </div>
    <div :class="(expanded) ? 'pure-u-3-4' : 'pure-u-1-2'">
      <div class="chatbox">
        <MessageComponent v-if="username" :username="username" @sendMessage="refreshList"/>
        <MessageNewComponent v-else @newMessage="refreshList"/>
        <font-awesome-icon v-if="expanded" :icon="['fas', 'chevron-left']" size="3x" class="expand" @click="minimizeChat" />
        <font-awesome-icon v-else :icon="['fas', 'chevron-right']" size="3x" class="expand" @click="expandChat" />
      </div>
    </div>
  </div>
</template>

<style scoped>

.page {
  margin-top: 1em;
}

.newMessage {
  margin-left: 1em;
}
.expand:hover {
  cursor: pointer;
}

.expand {
  margin-left: .25em;
}

.chatbox {
  display: flex;
  align-items: center;
  margin-left: 2em;
}

.messageList {
  display: flex;
  flex-direction: column;
  align-items: center;
}

section {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

button {
  margin-bottom: 2em;
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

.profiles {
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
