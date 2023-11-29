<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";

const props = defineProps(["task"]);
const emit = defineEmits(["editPost", "refreshPosts"]);
const { currentUsername } = storeToRefs(useUserStore());
</script>

<template>
  <div class="taskNotification">
    <!-- <p class="author">{{ props.post.author }}</p> -->
    <img v-if="url" class="image" ref="image" src="" alt="broken image url" />
    <p class="postText">{{ props.post.text }}</p>
    <div class="base alignment">
      <menu v-if="props.post.author == currentUsername">
        <li><button class="btn-small pure-button" @click="emit('editPost', props.post._id)">Edit</button></li>
        <li><button class="button-error btn-small pure-button" @click="deletePost">Delete</button></li>
      </menu>
      <article class="timestamp">
        <p v-if="props.post.dateCreated !== props.post.dateUpdated">Edited on: {{ formatDate(props.post.dateUpdated) }}</p>
        <p v-else>Created on: {{ formatDate(props.post.dateCreated) }}</p>
      </article>
    </div>
  </div>
</template>

<style scoped>
label {
  padding-top: 1em;
}
.icon {
  width: 1em;
}
.dropdownButton {
  width: 10em;
}

.host {
  font-weight: normal;
}

h2,
h3 {
  margin-top: 0;
  margin-bottom: 0;
}
p {
  margin: 0em;
}

.photo {
  height: 50vh;
  max-width: 100%;
  border-radius: 1em;
  object-fit: scale-down;
}

.title {
  font-weight: bold;
}

.options {
  display: flex;
  justify-content: space-between;
}

menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 1em;
  padding: 0;
  margin: 0;
}

.timestamp {
  display: flex;
  justify-content: flex-end;
  font-size: 0.9em;
  font-style: italic;
}

.base {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.base article:only-child {
  margin-left: auto;
}
</style>
