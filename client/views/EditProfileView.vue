<script setup lang = "ts">
import { ref } from 'vue';
import ChangeProfilePicture from "../components/Profile/ChangeProfilePicture.vue";
import ChangeTag from "../components/Profile/ChangeTag.vue";
import ChangeUsername from '../components/Setting/ChangeUsername.vue';
import router from '../router';
import { useUserStore } from '../stores/user';
import ChangeBadge from '../components/Profile/ChangeBadge.vue';

const isChangeBadgeOpen = ref(false);

const {currentUsername, currentProfilePicture, updateSession} = useUserStore();
const isChangeUsernameOpen = ref(false);
const isChangeProfilePicOpen = ref(false);
const isChangeTagOpen = ref(false);

const goBack = () => {
  router.go(-1);
};

const showChangeUsername = () => {
  isChangeUsernameOpen.value = true;
};

const updateUsername = () => {
    updateSession();
    isChangeUsernameOpen.value = false;
}

const showChangeProfilePic = () => {
  isChangeProfilePicOpen.value = true;
};

const updateProfilePic = () => {
    updateSession();
    isChangeProfilePicOpen.value = false;
}

const showChangeTag = () => {
  isChangeTagOpen.value = true;
};

const updateTag = () => {
    updateSession();
    isChangeTagOpen.value = false;
}


const showChangeBadge = () => {
  isChangeBadgeOpen.value = true;
};

const updateBadge = () => {
  // Logic to update the badge
  updateSession();
  isChangeBadgeOpen.value = false;
}

</script>
<template>
    <div class="modal-overlay">
      <div class="modal-content">
        <div class="header-container">
            <h1>Edit Profile</h1>
            <button class = "back-btn" @click="goBack">Back</button>
        </div>
        <hr>
        <div class = "column">
            <button class = "setting-selection" @click="showChangeUsername">Change Username</button>
            <ChangeUsername :isOpen="isChangeUsernameOpen" :currentUsername="currentUsername" @close="updateUsername"/>
            <button class = "setting-selection" @click="showChangeProfilePic">Change Profile Picture</button>
            <ChangeProfilePicture :isOpen="isChangeProfilePicOpen" @close="updateProfilePic"/>
            <button class = "setting-selection" @click="showChangeTag">Change Tag</button>
            <ChangeTag :isOpen="isChangeTagOpen" @close="updateTag"/>
            <!-- <button class = "setting-selection" @click="showChangeBadge">Change Badge</button>
            <ChangeBadge :isOpen="isChangeBadgeOpen" @close="updateBadge"/> -->
        </div>
        
        </div>
    </div>
    
</template>

<style scoped>
.header-container {
  display: flex;
  align-items: center; /* Vertically align items in the middle */
  justify-content: space-between; /* Space items out between their container */
  width: 100%; /* Take full width of its parent */
}
.back-btn{
    background-color: transparent;
    border: none;
    color: var(--dark-purple);
    font-size: 2.5vh;
    padding: 1vh;
    font-weight: 600;
    padding-right: 5%;
    padding-left: 5%;
}


.back-btn:hover{
    background-color: var(--blue-gray);
    color: var(--deep-purple);
}

</style>