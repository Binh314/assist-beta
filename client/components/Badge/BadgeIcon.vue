<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps({
  icon: String,
  badgeName: String,
  count: Number,
});
</script>

<template>
  <div class="badge-container">
    <img :src="props.icon" class="badge-icon" alt="Badge Icon"/>
    <span class="badge-name">{{ props.badgeName }}</span>
    <span>Count: {{ count }}</span>
  </div>
</template>

<style scoped>
.badge-container {
  /* border: black solid 2px; */
  display: flex;
  flex-direction: column; /* Stack children vertically */
  align-items: center; /* Center align items */
  padding-bottom: 10%;
  color: var(--dark-purple)
}

.badge-icon {
  object-fit: cover;
  width: 15vh; /* Adjust the size as needed */
  height: 15vh; /* Adjust the size as needed */
  margin-bottom: 1vh; /* Space between the icon and the name */
}

.badge-name {
  font-weight: 600;
}

</style>
``
