<script setup lang="ts">

import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onBeforeMount, onBeforeUnmount, ref, watch } from "vue";
import router from "../../router";
import { fetchy } from "../../utils/fetchy";
import ProfileChatComponent from "../Message/ProfileChatComponent.vue";

const text = ref("");
const props = defineProps(["username"]);
const emit = defineEmits(["sendMessage"])
const loaded = ref(false);
const { isLoggedIn, currentUsername } = storeToRefs(useUserStore());
const interval = ref();
const name = ref("");
const componentKey = ref(1);
const isFriend = ref(false);

let messages = ref<Array<Record<string, string>>>([]);

watch(async () => router.currentRoute.value.params.username, 
  async n => { 
    const user = await n;
    if (typeof user === "string") 
      name.value = user;
    else name.value = ""
    messages.value = [];
    componentKey.value = componentKey.value * -1;
    loaded.value = false;
  }
);

async function getMessages() {
  let messageResults;
  try {
    messageResults = await fetchy(`/api/message/user/${props.username}`, "GET")
  } catch (_) {
    return;
  }
  messages.value = messageResults;
  loaded.value = true;
}

const sendMessage = async (text: string) => {
  if (!text) return;
  try {
    await fetchy(`/api/message/${props.username}`, "POST", {
      body: { text }, alert: false
    });
  } catch (_) {
    return;
  }
  emptyForm();
  emit("sendMessage");
  await getMessages();
};

onBeforeMount(async () => {
  // const user = router.currentRoute.value.params.username;
  // console.log(user);
  // if (typeof user === "string")
  //   username.value = user;
  messages.value = [];
  name.value = props.username;
  console.log("mount");
  interval.value = setInterval(getMessages, 1000);
  componentKey.value = componentKey.value * -1;
  const friends = (await fetchy(`/api/friends`, "GET")).map((friend: Record<string, string>) => friend.username);
  isFriend.value = friends.includes(props.username);
  await getMessages();
  loaded.value = true;
});

async function goToProfile() {
  router.push(`/profile/${props.username}`)
}

onBeforeUnmount(async () => {
  console.log("unmount");
  clearInterval(interval.value);
});


const emptyForm = () => {
  text.value = "";
};
</script>

<template>
  <div class="messagesSection">
    <section class="profile">
      <ProfileChatComponent v-if="name" :username="name" :key="componentKey"/>
    </section>
    <section class="messages" >
      <body class = "message" v-for="message in messages">
        <div v-if="message.from === currentUsername" class="sentContainer">
          <p class="sent">
            {{ message.text }}
          </p>
        </div>
        <div v-else class="receivedContainer">
          <p class="received">
            {{ message.text }}
          </p>
        </div>
        <br/>
      </body>
    </section>
    <form v-if="loaded && isFriend" @submit.prevent="sendMessage(text)">
      <input id="text" v-model="text" placeholder="Enter text." autocomplete="off"/>
      <button type="submit" class="pure-button-primary pure-button sendButton">Send</button>
    </form>
    <form v-else-if="loaded && !isFriend" @submit.prevent="goToProfile">
      <input id="text" v-model="text" placeholder="You must be friends to message." autocomplete="off" disabled/>
      <button type="submit" class="pure-button-primary pure-button">See Profile</button>
    </form>
    <!-- <h2 v-else> Loading... </h2> -->
  </div>
</template>

<style scoped>

.sendButton {
  background-color: var(--dark-purple) !important;
}

h2 {
  text-align: center;
}

.messagesSection {
  border-style: solid;
  border-radius: 1em;
  background-color: white;
  border-radius: 1em;
  /* box-shadow: 0.5em 1em 1em black; */
  /* box-shadow: 1em 2em 1em black;
  border-width: .25em; */
}

.messages {
  display:flex;
  flex-direction: column-reverse;
}

.loading {
  background-color: black;
}

.sentContainer {
  display:flex;
  justify-content: flex-end;
  padding-right: 2em;
  padding-left: 50%;
}

.receivedContainer {
  display:flex;
  justify-content : flex-start;
  padding-left: 2em;
  padding-right: 50%;
}

.sent {
  background-color: var(--light-pink);
  padding: 0.5em 1em;
  border-radius: 1em;

  border-style: solid;
  /* box-shadow: 0.5em .5em 1em black; */
  border-width: .25em;
}

.received {
  padding: 0.5em 1em;
  background-color: var(--blue-gray);
  border-radius: 1em;

  border-style: solid;
  /* box-shadow: 0.5em .5em 1em black; */
  border-width: .25em;
}

.messagesSection {
  height:85vh;
  width:100%;
}

.messages {
  overflow-y: scroll;
  height: 80%;
}

form {
  background-color: var(--purple);
  border-radius: 1em;
  display: flex;
  flex-direction: row;
  gap: 0.5em;
  padding: 1em;
}

input {
  width:80%
}

button {
  width: 20%
}

.row {
  display: flex;
  justify-content: flex-start;
  margin: 0 auto;
  max-width: 100%;
}

label {
  padding-top: 1em;
}
.icon {
  width: 1em;
}
.dropdownButton {
  width: 10em;
}

.user {
  font-weight: normal;
}

h1 {
  margin-top: 0;
  margin-bottom: 0;
}

p {
  margin: 0em;
}

img {
  object-fit: cover;
  width: 25%;
  aspect-ratio: 1;
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
