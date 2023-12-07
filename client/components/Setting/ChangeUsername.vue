 
<script setup lang="ts">
import { defineEmits, ref, watch } from 'vue';
import { useUserStore } from '../../stores/user';

// Prop to control visibility from the parent component
const props = defineProps({
isOpen: Boolean,
currentUsername: String
});

const emit = defineEmits(["close"]);
const { updateUser, updateSession } = useUserStore();

const isVisible = ref(props.isOpen);
const oldUsername = ref(props.currentUsername)
const newUsername = ref("");

watch(() => props.isOpen, (newVal) => {
  isVisible.value = newVal;
});

const closeModal = () => {
  isVisible.value = false;
  emit('close');
};

async function updateUsername() {
  await updateUser({ username: newUsername.value });
  await updateSession();
  oldUsername.value = newUsername.value;
  newUsername.value = "";
  closeModal();
}


</script>

<template>
    <div v-if="isVisible" class="modal-overlay">
      <div class="modal-content">
        <button @click="closeModal" class = "exit-btn">
          <font-awesome-icon :icon="['fas', 'x']" size="lg"/>
        </button>
        <form  @submit.prevent="updateUsername">
            <h1>Update Username</h1>
            <fieldset class = "column">
                <label>Current Username: </label>
                <div class="pure-control-group">
                    <input class = "one-line-input" v-model.trim="oldUsername" disabled/>
                </div>
                <label>New Username: </label>
                <div class="pure-control-group">
                    <input class = "one-line-input" v-model="newUsername" id="aligned-password" placeholder="New Username" required />
                </div>
                <button type="submit" class = "primary-button">Submit</button>
            </fieldset>
        </form>
      </div>
    </div>
  </template>
 
  
  <style scoped>
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
  