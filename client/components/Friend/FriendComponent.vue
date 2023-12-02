<script setup lang="ts">
const props = defineProps(["username", "picture"]);
</script>

<template>
  <div class="friend" @click="$router.push(`/profile/${props.username}`)">
    <img class="circular-image" v-bind:src="props.picture" />
    <h4>{{ props.username }}</h4>
  </div>
</template>

<style scoped>
.friend {
  padding: 0.5em;
  border-radius: 1em;
  cursor: pointer;
}

.friend:hover {
  border-style: solid;
  border-color: var(--dark-purple);
}
.circular-image {
  border-radius: 50%; /* This creates the circular shape */
  object-fit: cover; /* Ensures the image covers the area without distorting */
  height: 20vh; /* Adjust this value as needed */
  width: 20vh; /* Make width equal to height for a perfect circle */
  overflow: hidden; /* This will clip the corners of the image */
  border: var(--dark-purple) solid 3px;
}

h4 {
  text-align: center;
}
</style>
