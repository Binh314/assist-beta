 
<script setup lang="ts">
import router from "@/router";
import { defineEmits, ref, watch } from 'vue';
import { useUserStore } from '../../stores/user';

// Prop to control visibility from the parent component
const props = defineProps({
isOpen: Boolean,
});

const emit = defineEmits(["close"]);
const { updateUser, updateSession, authUser, deleteUser } = useUserStore();

const isVisible = ref(props.isOpen);
const currentUsername = ref("");
const currentPassword = ref("");

watch(() => props.isOpen, (newVal) => {
  isVisible.value = newVal;
});

const closeModal = () => {
  isVisible.value = false;
  emit('close');
};

async function deleteAccount() {
  const auth = await authUser(currentUsername.value,currentPassword.value);
  if(auth){
    await deleteUser();
    await updateSession();
    void router.push({ name: "Home" });
  }else{
    alert("Incorrect Username/Password")
  }
}

</script>

<template>
    <div v-if="isVisible" class="modal-overlay">
      <div class="modal-content">
        <button @click="closeModal" class = "exit-btn">X</button>
        <form  @submit.prevent="deleteAccount">
            <h1>Delete Account</h1>
            <p>Are you sure you want to delete your account? This action is permanent and irreversable, all your badges and kudos will be lost</p>
            <fieldset class = "column">
              <label>Confirm Your Username: </label>
                <div class="pure-control-group">
                    <input class = "one-line-input" v-model="currentUsername" id="aligned-password" placeholder="Current Username" required />
                </div>
                <label>Confirm Your Password: </label>
                <div class="pure-control-group">
                    <input class = "one-line-input" v-model="currentPassword" id="aligned-password" placeholder="Current Password" type = "password" required />
                </div>
                <button type="submit" class = "primary-button">Delete My Account</button>
            </fieldset>
        </form>
      </div>
    </div>
  </template>
 
  
  <style scoped>
  form{
    margin-left: 5%;
    margin-right: 5%;
  }

  fieldset{
    border: none;
  }



  </style>
  