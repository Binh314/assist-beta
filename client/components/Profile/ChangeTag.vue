 
<script setup lang="ts">
import { defineEmits, onMounted, ref, watch } from 'vue';
import { useUserStore } from '../../stores/user';
import ImageUploader from '../ImageUploader.vue';
import { fetchy } from '../../utils/fetchy';
import TagInput from "../Tag/TAgsInput.vue";

const props = defineProps({
isOpen: Boolean,
});


const emit = defineEmits(["close"]);

const { updateUser, updateSession, loginUser, authUser, currentUsername, getUserID} = useUserStore();

const isVisible = ref(props.isOpen);
const userTags = ref([""]);
const newTags = ref([""])
var userID = "";


watch(() => props.isOpen, (newVal) => {
  isVisible.value = newVal;
});

const closeModal = () => {
  isVisible.value = false;
  emit('close');
};

async function detachTag(name:string){
    console.log(`Trying to detach: `,name)
    const currentTag = await fetchy(`/api/tag/name/${name}`,"GET");

    if(currentTag){
        console.log("found current tag");
        const response = await fetchy(`/api/tag/detach`,"PATCH",{body:{tagId: currentTag._id, itemId: userID}})
    }
}

async function attachTag(name:string){
    console.log(`Trying to attach: `,name)
    try{
        const currentTag = await fetchy(`/api/tag/name/${name}`,"GET");
        console.log("found current tag");
        const response = await fetchy(`/api/tag/attach`,"PATCH",{body:{tagId: currentTag._id, itemId: userID}})
    }
    catch{
        const response = await fetchy(`/api/tag`,"POST",{body:{i:userID,n:name}})
    }
}

async function uploadNewTag(){
    await getUserTags();

    console.log(`old: ${userTags.value}, new: ${newTags.value}`)
    for(const tag of newTags.value){
        if (!userTags.value.includes(tag)) {
            await attachTag(tag);
        }
    }

    for(const tag of userTags.value){
        if (!newTags.value.includes(tag)) {
            await detachTag(tag);
        }
    }

    userTags.value = newTags.value;

    closeModal();
}

async function handleUpdate(updatedTag){
    newTags.value = updatedTag
}

async function getUserTags(){
    try{
        const response = await fetchy(`/api/tag/user/${currentUsername}`,"GET");
        userTags.value = response.map((item)=>(item.name));
        console.log(`This is fetched: `,userTags.value)
    }
    catch{
        userTags.value = ['']
    }

    userTags.value.push("")
}

onMounted(async()=>{
    await getUserTags();

    userID = (await fetchy(`/api/users/${currentUsername}`,"GET"))._id;
    console.log(`This is userTag: `,userTags.value)
    
})
</script>

<template>
    <div v-if="isVisible" class="modal-overlay">
        <div class = "modal-content">
            <button @click="closeModal" class = "exit-btn">X</button>
                <h1>Update Tag</h1>
            <div class="content">
                <TagInput id="tagsInput" :initTags="userTags" @updateTags="(updatedTag)=>{handleUpdate(updatedTag)}"/>
                <button class="primary-button" @click = "uploadNewTag">Submit</button>
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
</style>