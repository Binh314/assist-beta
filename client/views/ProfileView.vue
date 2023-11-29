<script setup lang="ts">
import { onMounted, ref } from "vue";
import Badge from "../components/Badge/BadgeIcon.vue";
import ProfilePicture from "../components/Profile/ProfilePicture.vue";
import { useUserStore } from "../stores/user";
import { fetchy } from "../utils/fetchy";
import { useRouter } from "vue-router"; // Import useRouter



const router = useRouter();
const {currentUsername, currentProfilePicture} = useUserStore();
const kudos = ref(0)
const tags = ref([])

const navigateToSettings = () => {
    router.push('/settings'); // Replace '/settings' with your settings page route
};

onMounted(async () => {
    try {
        const response = await fetchy(`api/kudo/receivedCount/${currentUsername}`, "GET");
        kudos.value = ref(response); // assuming the response is the kudos count
    } catch (error) {
        console.error("Error fetching kudos:", error);
    }

    try {
        const response = await fetchy(`api/tag/user/${currentUsername}`, "GET")
        tags.value = response;
        tags.value = ["hello","wordld", "i Lovw", "you"]
    }
    catch (error) {
        console.error("Error fetching tags:", error);
    }
});

</script>

<template>
    <div class = "column">
        <ProfilePicture :pictureLink = currentProfilePicture />
        <span class = "username" >{{ currentUsername }}</span>
        <span class = "subtitle" >kudos: {{ kudos }}</span>
        <hr/>
        <span  class = "subtitle">Tags:</span>
        <div v-if="tags.length > 0">
            <ul>
                <li v-for="(tag, index) in tags.slice(0, 3)" :key="index">{{ tag }}</li>
                <span v-if="tags.length > 3">...</span>
            </ul>      
        </div>
        <div v-else>
            You have not selected any tag yet. <a href="/select-tags">Select here</a>
        </div>
        <span class = "subtitle">Badges:</span>
        <div class="badges-container">
            <Badge :icon="currentProfilePicture" badgeName="Challenge 1"/>
            <Badge :icon="currentProfilePicture" badgeName="Challenge 2"/>
            <Badge :icon="currentProfilePicture" badgeName="Challenge 3"/>
        </div>
        <button class = "setting-btn" @click="navigateToSettings">
            <img class = "setting-icon" src="@/assets/images/setting.png"/>
        </button>
    </div>
    
    
</template>

<style scoped>
hr{
    width: 30%;
    color: var(--purple);
}
.username{
    font-size: 4vh;
    color: var(--dark-purple);
}

.subtitle{
    font-size: 2.5vh;
    color: var(--dark-purple);
}

.badges-container {
    display: flex;
    justify-content: center; /* Center the badges horizontally */
    gap: 7vh; /* Adjust the space between badges */
}

.setting-btn{
    margin-top: 1vh;
    background: none;
    border: none;
}

.setting-icon{
    height: 8vh;
    width: 8vh;
}
</style>