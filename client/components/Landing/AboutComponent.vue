<script setup lang="ts">
import { ref } from "vue";

const showContent = ref(false);

function toggleCollapsible() {
  showContent.value = !showContent.value;
}
</script>

<template>
  <button type="button" class="collapsible" @click="toggleCollapsible()">
    <span>About this app</span>
    <span v-if="!showContent" class="material-symbols-outlined"> add </span>
    <span v-else class="material-symbols-outlined"> remove </span>
  </button>
  <div class="content" :class="{ active: showContent }">
    <div class="subcontent">
      <h3>Ask for help from friends!</h3>
      <p style="line-height: 1.5">
        Need help with a homework assignment, or a ride to the airport? Create a task on Assist to easily let your friends know what you need help with. Your friends can see the task and those that
        are willing and able may offer their help in completing these tasks.
      </p>
      <button class="pure-button" @click="$router.push('/create')">Create Tasks!</button>
    </div>
    <div class="subcontent">
      <h3>Help out your friends!</h3>
      <p style="line-height: 1.5">
        Support for your friends by checking the tasks they have requested help with, and offer your help! Assist's task matching algorithm matches you with tasks that you will likely be able to help
        with, based on similar tags between the task and your profile.
      </p>
      <button class="pure-button" @click="$router.push('/tasks')">Help Friends!</button>
    </div>
  </div>
</template>

<style scoped>
.collapsible {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--purple);
  color: white;
  cursor: pointer;
  padding: 1em;
  margin-top: 2em;
  width: 80%;
  border: none;
  text-align: left;
  outline: none;
}

/* Add a background color to the button if it is clicked on */
.collapsible:hover {
  background-color: var(--dark-purple);
}

/* Style the collapsible content. Note: hidden by default */
.content {
  width: 80%;
  overflow: hidden;
  background-color: var(--base-bg);
  display: flex;
  max-height: 0;
  transition: max-height 0.3s ease;
}

.subcontent {
  width: 50%;
  padding: 1em;
  text-align: center;
}

/* Adjust the height property for smooth transition */
.content.active {
  max-height: 40vh;
}
</style>
