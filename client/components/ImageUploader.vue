<script setup lang="ts">
import { initializeApp } from "firebase/app";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { defineEmits, ref as vueRef } from "vue";

const imageUpload = vueRef();
const imageSrc = vueRef();

const emit = defineEmits(['update:imageSrc']);

const firebaseConfig = {
  apiKey: "AIzaSyD2j1ypdzQ-sYci8KhspfjAzLm_Up6VErw" ,
  authDomain: "interlives-c40b5.firebaseapp.com",
  projectId: "interlives-c40b5",
  storageBucket:"interlives-c40b5.appspot.com",
  messagingSenderId: "1051328712035",
  appId: "1:1051328712035:web:5488f26fae65422bf55756"
};

initializeApp(firebaseConfig);

const storage = getStorage();


function handleFileChange(event:Event) {
    if( event.target){
      const target = event.target as HTMLInputElement;
      if(target?.files?.length) {
          imageUpload.value = target.files[0];
      }
    }
    uploadImage();
}

const uploadImage = () => {
  const file = imageUpload.value as File;
  const imageRef = ref(storage, `auth/${file.name}`);

  uploadBytes(imageRef,imageUpload.value).then((response)=>{
    console.log(response)
    getDownloadURL(ref(storage, response.ref.fullPath)).then((url)=>
    {
      imageSrc.value = url
      emit("update:imageSrc",url)
    })
    console.log(`this is url from imageUploader: ${imageSrc.value}`);
    alert(`Image Uploaded!`)
  })
}

function triggerInput() {
  const fileInput = document.getElementById('fileInput');
  if (fileInput) {
    fileInput.click();
  }
}
</script>


<template>
    <div>
       <div class = "uploaded">
        <img v-if="imageSrc" class = "ProfilePicture" :src="imageSrc" alt="Your Image">
       </div>
      <br />
      <input type="file" id="fileInput" class="hidden-file-input" @change="handleFileChange" style = "display:none">
      <button class="primary-button" @click="triggerInput">Choose File</button>
      <br />
    </div>
</template>
  
  
 
<style scoped>

.uploaded{
    border: black;
    max-width: 10vw;
    max-height: 100%;
    align-items: center;
    justify-content: center;
    display: flex;;
}
</style>
