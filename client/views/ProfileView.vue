<script setup lang="ts">
import { ObjectId } from "mongodb";
import { onMounted, ref } from "vue";
import Badge from "../components/Badge/BadgeIcon.vue";
import FriendButton from "../components/Friend/FriendButton.vue";
import ProfilePicture from "../components/Profile/ProfilePicture.vue";
import router from "../router";
import { useUserStore } from "../stores/user";
import { fetchy } from "../utils/fetchy";

interface Badge {
  icon: string;
  name: string;
  count: number;
}

const props = defineProps(["user"]);
const { currentUsername, currentProfilePicture } = useUserStore();
const kudos = ref("0");
const tags = ref([]);
const badges = ref<Badge[]>([]);
const username = ref(currentUsername);
const profilePicture = ref(currentProfilePicture);
const displayTags = ref(false);

function editProfile() {
  router.push("/profile/edit");
}

function gotoKudos() {
  router.push("/kudos");
}

async function goToMessages() {
  void router.push(`/messages/${username.value}`);
}

onMounted(async () => {
  if (props.user !== undefined && props.user !== currentUsername && typeof props.user === "string") {
    try {
      const response = await fetchy(`/api/users/${props.user}`, "GET");
      username.value = props.user;
      profilePicture.value = response.picture;
    } catch (error) {
      await router.push("/not-found");
    }
  }

  try {
    const receiverId = await fetchy(`/api/users/${username.value}`, "GET");
    const response = await fetchy(`/api/kudo/receivedCount/${receiverId._id}`, "GET");
    kudos.value = response; // assuming the response is the kudos count
  } catch (error) {
    console.error("Error fetching kudos:", error);
  }

  try {
    const response = await fetchy(`/api/tag/user/${username.value}`, "GET");
    tags.value = response.map((item: { name: String; item: Array<ObjectId> }) => item.name);
  } catch (error) {
    console.error("Error fetching tags:", error);
  }

  try {
    const response = await fetchy(`/api/badges/${username.value}`, "GET");
    console.log(`this is badge response: `, response);
    badges.value = response;
  } catch (error) {
    console.log(`Error fetching badges:`, error);
  }
});
</script>

<template>
  <div class="column">
    <ProfilePicture :pictureLink="profilePicture" />
    <span class="username cursor" v-if="username !== currentUsername" @click.stop="goToMessages" title="send message">
      {{ username }}
    </span>
    <span class="username" v-else>
      {{ username }}
    </span>
    <span class="kudos">kudos: {{ kudos }}</span>
    <div v-if="username == currentUsername" class="button-container">
      <button class="pure-button-primary pure-button theme" @click="editProfile">Edit Profile</button>
    </div>
    <div v-else>
      <FriendButton :friend="username" />
    </div>
    <span class="subtitle">Tags:</span>
    <div class="tags" v-if="tags.length > 0">
      <ul v-if = "!displayTags">
        <li v-for="(tag, index) in tags.slice(0, 3)" :key="index">{{ tag }}</li>
        <span class = "expand" v-if="tags.length > 3" @click = "displayTags = true">...</span>
      </ul>
      <ul v-else>
        <li v-for="(tag, index) in tags" :key="index">{{ tag }}</li>
      </ul>
    </div>
    <div v-else-if="username == currentUsername">You have not selected any tag yet. <router-link to="/profile/edit">Select here</router-link></div>
    <span class="subtitle">Badges:</span>
    <div class="badges-container">
      <div v-for="[index, badge] in Object.entries(badges)">
        <Badge :icon="badge.icon" :badgeName="badge.name" :count="badge.count"></Badge>
      </div>
    </div>
  </div>
</template>

<style scoped>
.expand{
  border-bottom:1px solid #000;
  padding-left: 5%;
  padding-right: 5%;
}

.expand:hover{
  background-color: var(--blue-gray);
}

.column {
  margin: 1em 0;
}

ul {
  margin: 0;
}
.button-container {
  width: 20%;
  height: 4.5vh;
  display: flex;
  justify-content: center;
  margin-top: 1em;
}

.username {
  font-size: 5vh;
  font-weight: 700;
  color: var(--deep-purple);
}

.cursor {
  cursor: pointer;
}

.subtitle {
  font-size: 2.75vh;
  font-weight: 550;
  color: var(--dark-purple);
  margin-top: 1em;
}

.kudos {
  font-size: 2.75vh;
  font-weight: 550;
  color: var(--dark-purple);
}

.badges-container {
  display: flex;
  flex-direction: row;
  gap: 7vh; /* Adjust the space between badges */
}

.tags {
  color: var(--deep-purple);
}

.icon {
  width: 1em;
}
.messageIcon:hover {
  cursor: pointer;
}

.theme {
  background-color: var(--purple);
}

.theme:hover {
  background-color: var(--light-pink);
}
</style>
