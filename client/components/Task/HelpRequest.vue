<script setup lang="ts">
// import { ref } from "vue";

const props = defineProps(["reminder"]);
const emit = defineEmits(["removeNotification", "showTask"]);

async function goToTask() {
  // router.push(`/task/${props.reminder.contentId}`);
  emit('showTask', props.reminder.contentId);
}
</script>

<template>
  <div class="taskNotification" @click="goToTask" title="click to view task">
    <font-awesome-icon icon="x" size="lg" class="icon" @click.stop="emit('removeNotification', props.reminder._id)" />
    <p>{{ props.reminder.message }}</p>
  </div>
</template>

<style scoped>
.link {
  margin-top: 1em;
  text-align: center;
  background-color: white;
}

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
  background-color: #5c509c;
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
