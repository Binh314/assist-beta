 
<script setup lang="ts">
import { defineEmits, ref, watch } from 'vue';
import { useUserStore } from '../../stores/user';
import ImageUploader from '../ImageUploader.vue';

const props = defineProps({
isOpen: Boolean,
});

const emit = defineEmits(["close"]);
const { updateUser, updateSession, loginUser, authUser } = useUserStore();

const isVisible = ref(props.isOpen);
const newPicture = ref("");


watch(() => props.isOpen, (newVal) => {
  isVisible.value = newVal;
});

const closeModal = () => {
  isVisible.value = false;
  emit('close');
};

function handleUpload(url:string){
    newPicture.value = url;
}

async function uploadNewProfilePicture(){
    await updateUser({picture:newPicture.value});
    await updateSession();
    closeModal();
}

</script>

<template>
    <div v-if="isVisible" class="modal-overlay">
        <div class = "modal-content">
            <button @click="closeModal" class = "exit-btn">
                <font-awesome-icon :icon="['fas', 'x']" size="lg"/>
            </button>
                <h1>Update Profile Picture</h1>
            <div class="content">
                <ImageUploader @update:imageSrc="handleUpload"/>
                <hr/>
                <button class="primary-button" @click = "uploadNewProfilePicture">Submit</button>
            </div>
            
        </div>
    </div>
</template>

<style scoped>
.content {
    display: flex;
    flex-direction: column; /* Stack children vertically */
    align-items: center; /* Align items in the center horizontally */
    gap: 10px; /* Space between items */
}

.exit-btn:hover {
    cursor: pointer;
}
</style>