<script setup lang = "ts">
import { ref } from 'vue';
import ChangeUsername from '../components/Setting/ChangeUsername.vue';
import { useUserStore } from '../stores/user';

const {currentUsername, currentProfilePicture, updateSession} = useUserStore();
const isChangeUsernameOpen = ref(false);

const showChangeUsername = () => {
  isChangeUsernameOpen.value = true;
};

const updateUsername = () => {
    updateSession();
    isChangeUsernameOpen.value = false;
}
</script>

<template>
    <h1>Setting</h1>
    <button @click="showChangeUsername">Update Username</button>
    <ChangeUsername :isOpen="isChangeUsernameOpen" :currentUsername="currentUsername" @close="updateUsername"/>
</template>

<style scoped>

</style>