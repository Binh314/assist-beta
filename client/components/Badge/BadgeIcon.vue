<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps({
  icon: String,
  badgeName: String
});
</script>

<template>
  <div class="badge-container">
    <img :src="props.icon" class="badge-icon" alt="Badge Icon"/>
    <span class="badge-name">{{ props.badgeName }}</span>
  </div>
</template>

<style scoped>
.badge-container {
  display: flex;
  flex-direction: column; /* Stack children vertically */
  align-items: center; /* Center align items */
  padding-bottom: 10%;
  color: var(--dark-purple)
}

.badge-icon {
  object-fit: cover;
  width: 125px; /* Adjust the size as needed */
  height: 125px; /* Adjust the size as needed */
  margin-bottom: 10px; /* Space between the icon and the name */
}

.badge-name {
  /* Style for the badge name */
}

</style>
``
