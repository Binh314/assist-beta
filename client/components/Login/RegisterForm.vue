<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import ImageUploader from "../ImageUploader.vue";
import TagsInput from "../Tag/TagsInput.vue";

const username = ref("");
const password = ref("");
const profile = ref("");
const tag = ref([""]);
const { createUser, loginUser, updateSession } = useUserStore();

async function attachTag(tags:string[]){
  const userID = (await fetchy(`/api/users/${username.value}`,"GET"))._id;
  for(const t of tags.slice(0,-1)){
    try{
      const response = await fetchy('/api/tag',"POST",{body:{i:userID,n:t}})
    }
    catch{
      return new Error(`Fail to attached tag - ${t}`)
    }
  }
}

async function register() {
  await createUser(username.value, password.value, profile.value);
  await loginUser(username.value, password.value);
  await attachTag(tag.value);
  void updateSession();
  void router.push({ name: "Task" });
}

async function handleImageUpload(url: string) {
  profile.value = url;
}

async function handleTagChange(newTag: string[]){
  tag.value = newTag;
}
</script>

<template>
  <div class="register-form">
    <form @submit.prevent="register">
      <h1>Register User</h1>
      <div class="form-content">
        <div class="image-uploader-wrapper">
          <ImageUploader @update:imageSrc="(url) => handleImageUpload(url)" />
        </div>
        <fieldset class="column">
          <div class="pure-control-group">
            <input class="one-line-input" v-model.trim="username" type="text" id="aligned-name" placeholder="Username" required />
          </div>
          <div class="pure-control-group">
            <input class="one-line-input" type="password" v-model.trim="password" id="aligned-password" placeholder="Password" required />
          </div>
        </fieldset>
      </div>
      <hr/>
      <div class = "tag-container">
        <h2>Select Tags</h2>
        <p>Please indicate area you are interested in giving help in</p>
        <TagsInput :initTags="tag" @updateTags="(updatedTag)=>{handleTagChange(updatedTag)}"/>
      </div>
      
      <hr/>
      <button type="submit" class="primary-button">Register</button>
    </form>
  </div>
</template>

<style scoped>
.tag-container{
  padding: 10%;
}

hr{
  width: 100%;
}
.register-form {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
}

form {
  width: 100%;
  max-width: 2000px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.form-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-end; /* Aligns items at the bottom */
  width: 100%;
  margin-bottom: 10%;
}

.image-uploader-wrapper {
  flex: 1;
  margin-right: 20%;
  width: 100%;
}

.column {
  flex: 2;
  border: none;
  padding: 20%;
}

.button-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
}

h1 {
  font-size: 4vh;
}
</style>
