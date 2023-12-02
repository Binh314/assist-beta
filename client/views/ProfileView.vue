<script setup lang="ts">
import { ObjectId } from "mongodb";
import { onMounted, ref } from "vue";
import Badge from "../components/Badge/BadgeIcon.vue";
import ProfilePicture from "../components/Profile/ProfilePicture.vue";
import router from "../router";
import { useUserStore } from "../stores/user";
import { fetchy } from "../utils/fetchy";

interface Badge {
  icon: string;
  name: string;
  count: number;
}

const { currentUsername, currentProfilePicture } = useUserStore();
const kudos = ref(0);
const tags = ref([]);
const badges = ref<Badge[]>([]);
const username = ref(currentUsername);
const profilePicture = ref(currentProfilePicture);

function editProfile() {
  router.push("/profile/edit");
}

onMounted(async () => {
  const userPath = router.currentRoute.value.params.username;
  if (userPath !== undefined && userPath !== currentUsername && typeof userPath === "string") {
    try {
      const response = await fetchy(`api/users/${userPath}`, "GET");
      username.value = userPath;
      profilePicture.value = response.picture;
    } catch (error) {
      await router.push("/not-found");
    }
  }

  try {
    const response = await fetchy(`api/kudo/receivedCount/${username.value}`, "GET");
    kudos.value = ref(response); // assuming the response is the kudos count
  } catch (error) {
    console.error("Error fetching kudos:", error);
  }

  try {
    const response = await fetchy(`api/tag/user/${username.value}`, "GET");
    tags.value = response.map((item: { name: String; item: Array<ObjectId> }) => item.name);
  } catch (error) {
    console.error("Error fetching tags:", error);
  }

  try {
    const response = await fetchy(`api/badges/${username.value}`, "GET");
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
    <span class="username">{{ username }}</span>
    <span class="subtitle">kudos: {{ kudos }}</span>
    <div v-if="username == currentUsername" class="button-container">
      <button class="primary-button" @click="editProfile">Edit Profile</button>
    </div>
    <div v-else>
      <button class="primary-button">Add Friend</button>
      <!-- TODO -->
    </div>
    <span class="subtitle">Tags:</span>
    <div class="tags" v-if="tags.length > 0">
      <ul>
        <li v-for="(tag, index) in tags.slice(0, 3)" :key="index">{{ tag }}</li>
        <span v-if="tags.length > 3">...</span>
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
.button-container {
  width: 20%;
  height: 4.5vh;
  display: flex;
  justify-content: center;
}

.username {
  font-size: 5vh;
  font-weight: 700;
  color: var(--deep-purple);
}

.subtitle {
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
</style>
