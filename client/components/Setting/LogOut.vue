 
<script setup lang="ts">
import router from "@/router";
import { defineEmits, ref, watch } from 'vue';
import { useUserStore } from '../../stores/user';

// Prop to control visibility from the parent component
const props = defineProps({
isOpen: Boolean,
});

const emit = defineEmits(["close"]);
const { logoutUser} = useUserStore();

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

async function Logout() {
  await logoutUser()
  void router.push({ name: "Home" });
}

</script>

<template>
    <div v-if="isVisible" class="modal-overlay">
      <div class="modal-content">
        <button @click="closeModal" class = "exit-btn">
          <font-awesome-icon :icon="['fas', 'x']" size="lg"/>
        </button>
        <form  @submit.prevent="Logout">
            <h1>Log Out</h1>
            <div class = "btn-container">
              <button type="submit" class = "primary-button">Log Out</button>
            </div>
        </form>
      </div>
    </div>
  </template>
 
  
  <style scoped>
  .btn-container{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .primary-button{
    margin-top: 10%;
    width: 100%;
    height: 10vh;
    font-size: 4vh;
    font-weight: 600;
  }

  form{
    margin-left: 5%;
    margin-right: 5%;
  }

  fieldset{
    border: none;
  }

  .exit-btn:hover {
    cursor: pointer;
  }

  </style>
  