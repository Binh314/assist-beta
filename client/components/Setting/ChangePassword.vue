 
<script setup lang="ts">
import { defineEmits, ref, watch } from 'vue';
import { useUserStore } from '../../stores/user';

const props = defineProps({
isOpen: Boolean,
});

const emit = defineEmits(["close"]);
const { updateUser, updateSession, loginUser, authUser } = useUserStore();

const isVisible = ref(props.isOpen);
const currentUsername = ref("");
const currentPassword = ref("");
const newPassword = ref("");

watch(() => props.isOpen, (newVal) => {
  isVisible.value = newVal;
});

const closeModal = () => {
  isVisible.value = false;
  emit('close');
};

async function updatePassword() {
  const auth = await authUser(currentUsername.value,currentPassword.value);
  if(auth){
    await updateUser({ password: newPassword.value });
    await updateSession();
    newPassword.value = "";
    closeModal();
  }else{
    alert("Incorrect Username/Password")
  }
  
}

</script>

<template>
    <div v-if="isVisible" class="modal-overlay">
      <div class="modal-content">
        <button @click="closeModal" class = "exit-btn">
          <font-awesome-icon :icon="['fas', 'x']" size="lg"/>
        </button>
        <form  @submit.prevent="updatePassword">
            <h1>Update Password</h1>
            <fieldset class = "column">
                <label>Current Username: </label>
                <div class="pure-control-group">
                    <input class = "one-line-input" v-model="currentUsername" id="aligned-password" placeholder="Current Username" required />
                </div>
                <label>Current Password: </label>
                <div class="pure-control-group">
                    <input class = "one-line-input" v-model="currentPassword" id="aligned-password" placeholder="Current Password" type = "password" required />
                </div>
                <hr/>
                <label>New Password: </label>
                <div class="pure-control-group">
                    <input class = "one-line-input" v-model="newPassword" id="aligned-password" placeholder="New Password" type = "password" required />
                </div>
                <button type="submit" class = "primary-button">Submit</button>
            </fieldset>
        </form>
      </div>
    </div>
  </template>
 
  
  <style scoped>
  hr{
    width: 100%;
    color: var(--dark-purple);
    background-color: var(--dark-purple);
    height: 1px;
  }

  h1{
    margin-left: 5%;
  }

  fieldset{
    border: none;
  }

  .exit-btn:hover {
    cursor: pointer;
  }


  </style>
  