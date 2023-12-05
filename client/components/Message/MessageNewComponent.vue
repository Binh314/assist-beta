<script setup lang="ts">

import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onBeforeMount, onBeforeUnmount, ref } from "vue";
import router from "../../router";
import { fetchy } from "../../utils/fetchy";

const text = ref("");
const emit = defineEmits(["refreshPosts"]);
const props = defineProps(["username"]);
const loading = ref(false);
const { isLoggedIn, currentUsername } = storeToRefs(useUserStore());
const interval = ref();
const validUsername = ref(false);
const username = ref("");
const isFriend = ref(false);

let messages = ref<Array<Record<string, string>>>([]);
const navColor = ref("#F98A1D");

const matchingUsers = ref<Array<Record<string, string>>>([]);

async function updateUsername(u: string) {
  username.value = u;
  await checkProfile();
}

async function getMatchingUsers(prefix: string) {
  await checkProfile();
  if (prefix === "") {
    matchingUsers.value = [];
    return;
  }
  let userResults;
  try {
    userResults = await fetchy(`/api/users/matching/${prefix}`, "GET", {alert: false});
  } catch {
    return;
  }
  matchingUsers.value = userResults;
}

async function goToMessages() {
  void router.push({ name: "Messages", params: {username: username.value}});
}

async function getMessages() {
  let messageResults;
  try {
    messageResults = await fetchy(`/api/message/user/${username.value}`, "GET", {alert: false})
  } catch (_) {
    return;
  }
  messages.value = messageResults;
}

async function goToProfile() {
  router.push(`/profile/${username.value}`)
}

async function checkProfile() {
  loading.value = true;
  if (username.value.length > 0)
    try {
      await fetchy(`/api/users/${username.value}`, "GET", {alert: false});
      validUsername.value = true;

      const friends = await fetchy(`/api/friends`, "GET", {alert: false});
      isFriend.value = friends.includes(username);

      await getMessages();
    } catch (_) {
      validUsername.value = false;
      messages.value = [];
    }
  loading.value = false;
}

const sendMessage = async (text: string) => {
  if (!text) return;
  try {
    await fetchy(`/api/message/${username.value}`, "POST", {
      body: { text }, alert: false
    });
  } catch (_) {
    return;
  }
  emptyForm();
  await goToMessages();
};

onBeforeMount(async () => {
});

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
      <form class="userForm" @submit.prevent="sendMessage(text)">
      <!-- <label for="username">New Message To:</label> -->
      <!-- <input id="userInput" type="text" :class="(validUsername) ? 'valid' : 'invalid'" v-model="username" placeholder="Enter username to message." autocomplete="off" @input="checkProfile"/> -->
      <input id="username" :class="(validUsername) ? 'valid' : 'invalid'" type="text" v-model="username" @input="getMatchingUsers(username)" autocomplete="off" placeholder="Enter user to message." />
      </form>
      <div class="searchresults" v-if="matchingUsers.length > 0 && !validUsername">
        <div v-for="user in matchingUsers" :key="user._id">
          <div class="resultentry" @click="updateUsername(user.username)">
            <span>{{ user.username }}</span>
          </div>
        </div>
      </div>
    </section>
    <section class="messages">
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
    <!-- <form v-if="validUsername" @submit.prevent="sendMessage(text)">
      <input id="text" v-model="text" placeholder="Enter text." autocomplete="off"/>
      <button type="submit" class="pure-button-primary pure-button">Send</button>
    </form> -->
    <form v-if="validUsername && isFriend" @submit.prevent="sendMessage(text)">
      <input id="text" v-model="text" placeholder="Enter text." autocomplete="off"/>
      <button type="submit" class="pure-button-primary pure-button">Send</button>
    </form>
    <form v-else-if="validUsername && !isFriend" @submit.prevent="goToProfile">
      <input id="text" v-model="text" placeholder="You must be friends to message." autocomplete="off" disabled/>
      <button type="submit" class="pure-button-primary pure-button">See Profile</button>
    </form>
  </div>
</template>

<style scoped>

/* .searchbar {
  display: flex;
  justify-content: center;
  gap: 0.5em;
  margin: 1em 0 0 0;
  align-items: center;
} */
.searchresults {
  position: absolute;
  width: 40%;
  margin: 0 auto;
  background-color: lightgray;
  border: 1px solid #ccc;
  /* box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); */
  z-index: 1; /* Ensure the results are above other content */
  padding-left: 0.5em;
}


.resultentry {
  padding: 0.5em;
  cursor: pointer;
}

.profile {
  border-bottom:solid;
  border-radius : 1em;
}

form {
  background-color: var(--purple);
  border-radius: 1em;
  display: flex;
  flex-direction: row;
  gap: 0.5em;
  padding: 1em;
}

.userForm {
  display:flex;
  align-items: center;

}


.valid {
  color: black;
  width: 50%;
}
.invalid {
  color: darkred;
  width: 50%;
}
.messagesSection {
  border-style: solid;
  border-radius: 1em;
  background-color: white;
  /* box-shadow: 0.5em 1em 1em black; */
  border-width: .25em;
}

.messages {
  display:flex;
  flex-direction: column-reverse;
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
  height: 80%;
  overflow-y: scroll;
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
