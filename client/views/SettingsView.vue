<script setup lang = "ts">
import { ref } from 'vue';
import ChangeUsername from '../components/Setting/ChangeUsername.vue';
import ChangePassword from "../components/Setting/ChangePassword.vue";
import { useUserStore } from '../stores/user';

const {currentUsername, currentProfilePicture, updateSession} = useUserStore();
const isChangeUsernameOpen = ref(false);
const isChangePasswordOpen = ref(false);

const showChangeUsername = () => {
  isChangeUsernameOpen.value = true;
};

const updateUsername = () => {
    updateSession();
    isChangeUsernameOpen.value = false;
}

const showChangePassword = () => {
  isChangePasswordOpen.value = true;
};

const updatePassword = () => {
    updateSession();
    isChangePasswordOpen.value = false;
}
</script>

<template>
    <div class="modal-overlay">
      <div class="modal-content">
        <h1>Setting</h1>
        <div class = "column">
            <button @click="showChangeUsername">Change Username</button>
            <ChangeUsername :isOpen="isChangeUsernameOpen" :currentUsername="currentUsername" @close="updateUsername"/>
            <button @click="showChangePassword">Change Password</button>
            <ChangePassword :isOpen="isChangePasswordOpen" @close="updatePassword"/>
        </div>
        
      </div>
    </div>
    
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(90,80,96,0.5); /* Semi-transparent black */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* Ensure it's above other content */
}

/* Modal content style */
.modal-content {
  background-color: white;
  min-width: 30%;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1001;
}
</style>