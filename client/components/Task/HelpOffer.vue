<script setup lang="ts">
import router from "@/router";
import { fetchy } from "../../utils/fetchy";

// import { ref } from "vue";

const props = defineProps(["reminder"]);
const emit = defineEmits(["removeNotification"]);

async function goToMessage() {
  const username = (await fetchy(`/api/users/id/${props.reminder.contentId}`, "GET")).username;
  router.push(`/messages/${username}`);
}
</script>

<template>
  <div class="taskNotification" @click="goToMessage" title="click to send message">
    <font-awesome-icon icon="x" size="lg" class="icon" @click.stop="emit('removeNotification', props.reminder._id)" />
    <p>{{ props.reminder.message }}</p>
  </div>
</template>

<style scoped>
.icon {
  color: white;
  position: absolute;
  top: 0.5em;
  right: 0.5em;
}

.icon:hover {
  cursor: pointer;
}
.taskNotification {
  position: relative;
  display: flex;
  width: 30em;
  height: 5em;
  background-color: #a080e3;
  color: white;
  text-align: center;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5em;
}
.taskNotification:hover {
  cursor: pointer;
}
</style>
