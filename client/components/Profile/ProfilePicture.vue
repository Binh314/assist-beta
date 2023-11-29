<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps({
  pictureLink: String
});
</script>

<template>
    <div class="profile-picture">
        <img :src="props.pictureLink" class="circular-image"/>
    </div>
</template>

<style scoped>
.profile-picture {
    display: flex;
    justify-content: center;
    margin-top: 3vh;
}

.circular-image {
    border-radius: 50%; /* This creates the circular shape */
    object-fit: cover; /* Ensures the image covers the area without distorting */
    height: 20vh; /* Adjust this value as needed */
    width: 20vh; /* Make width equal to height for a perfect circle */
    overflow: hidden; /* This will clip the corners of the image */
    border: var(--dark-purple) solid 3px;
}
</style>