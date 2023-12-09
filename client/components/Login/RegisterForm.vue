<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { ref } from "vue";
import { useToastStore } from "../../stores/toast";
import { fetchy } from "../../utils/fetchy";
import ImageUploader from "../ImageUploader.vue";
import TagsInput from "../Tag/TagsInput.vue";

const username = ref("");
const password = ref("");
const retypePassword = ref("");
const profile = ref("");
const tag = ref([""]);
const uploaded = ref(false);
const { createUser, loginUser, updateSession } = useUserStore();

async function attachTag(tags: string[]) {
  const userID = (await fetchy(`/api/users/${username.value}`, "GET"))._id;
  for (const t of tags) {
    if (t) {
      try {
        const response = await fetchy("/api/tag", "POST", { body: { i: userID, n: t } });
      } catch {
        return new Error(`Fail to attached tag - ${t}`);
      }
    }
  }
}

async function register() {
  if (password.value !== retypePassword.value) {
    useToastStore().showToast({ message: "Passwords do not match", style: "error" });
    throw new Error("Passwords do not match");
  }
  await createUser(username.value, password.value, profile.value);
  await loginUser(username.value, password.value);
  await attachTag(tag.value);
  void updateSession();
  void router.push({ name: "Home" });
}

async function handleImageUpload(url: string) {
  profile.value = url;
  uploaded.value = true;
}

async function handleTagChange(newTag: string[]) {
  tag.value = newTag;
}
</script>

<template>
  <div class="register-form">
    <form @submit.prevent="register">
      <h1>Register User</h1>
      <div class="form-content">
        <div class="image-uploader-wrapper column">
          <h3>Profile Picture</h3>
          <p v-if="!uploaded">No image chosen</p>
          <ImageUploader @update:imageSrc="(url) => handleImageUpload(url)" />
        </div>
        <fieldset class="column">
          <div class="pure-control-group">
            <input class="one-line-input" v-model.trim="username" type="text" id="aligned-name" placeholder="Username" required />
          </div>
          <div class="pure-control-group">
            <input class="one-line-input" type="password" v-model.trim="password" id="aligned-password" placeholder="Password" required />
          </div>
          <div class="pure-control-group">
            <input class="one-line-input" type="password" v-model.trim="retypePassword" id="aligned-password-retype" placeholder="Retype Password" required />
          </div>
        </fieldset>
      </div>
      <hr />
      <div class="tag-container">
        <h2>Select Tags</h2>
        <p>Please indicate area you are interested in giving help in</p>
        <TagsInput
          :initTags="tag"
          @updateTags="
            (updatedTag) => {
              handleTagChange(updatedTag);
            }
          "
        />
      </div>

      <hr />
      <button type="submit" class="primary-button">Register</button>
    </form>
  </div>
</template>

<style scoped>
.tag-container {
  padding: 10%;
}

hr {
  width: 100%;
}
.register-form {
  display: flex;
  justify-content: center;
  align-items: center;
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
  align-items: space-between; /* Aligns items at the bottom */
  width: 100%;
  margin-bottom: 10%;
}

.image-uploader-wrapper {
  flex: 1;
  width: 100%;
  text-align: center;
}

.column {
  flex: 2;
  border: none;
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
