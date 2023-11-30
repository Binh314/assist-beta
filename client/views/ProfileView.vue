<script setup lang="ts">
import { ObjectId } from "mongodb";
import { onMounted, ref } from "vue";
import Badge from "../components/Badge/BadgeIcon.vue";
import ProfilePicture from "../components/Profile/ProfilePicture.vue";
import router from "../router";
import { useUserStore } from "../stores/user";
import { fetchy } from "../utils/fetchy";

const {currentUsername, currentProfilePicture} = useUserStore();
const kudos = ref(0)
const tags = ref([])

function editProfile(){
    router.push("/profile/edit")
}


onMounted(async () => {
    try {
        const response = await fetchy(`api/kudo/receivedCount/${currentUsername}`, "GET");
        kudos.value = ref(response); // assuming the response is the kudos count
    } catch (error) {
        console.error("Error fetching kudos:", error);
    }

    try {
        const response = await fetchy(`api/tag/user/${currentUsername}`, "GET")
        tags.value = response.map((item:{
                                        name: String;
                                        item: Array<ObjectId>;
                                        })=>item.name)
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
        <div class = "button-container">
            <button class="primary-button" @click = "editProfile">Edit Profile</button>
        </div>
        <span  class = "subtitle">Tags:</span>
        <div class = "tags" v-if="tags.length > 0">
            <ul>
                <li v-for="(tag, index) in tags.slice(0, 3)" :key="index">{{ tag }}</li>
                <span v-if="tags.length > 3">...</span>
            </ul>      
        </div>
        <div v-else>
            You have not selected any tag yet. <router-link to="/profile/edit">Select here</router-link>
        </div>
        <span class = "subtitle">Badges:</span>
        <div class="badges-container">
            <Badge :icon="currentProfilePicture" badgeName="Challenge 1"/>
            <Badge :icon="currentProfilePicture" badgeName="Challenge 2"/>
            <Badge :icon="currentProfilePicture" badgeName="Challenge 3"/>
        </div>
    </div>
    
    
</template>

<style scoped>
.button-container{
    width: 20%;
    height: 4.5vh;
    display: flex;
    justify-content: center;
}

.username{
    font-size: 5vh;
    font-weight: 700;
    color: var(--deep-purple);
}

.subtitle{
    font-size: 2.75vh;
    font-weight: 550;
    color: var(--dark-purple);
}

.badges-container {
    display: flex;
    justify-content: center; /* Center the badges horizontally */
    gap: 7vh; /* Adjust the space between badges */
}

.tags{
    color: var(--deep-purple);
}

</style>