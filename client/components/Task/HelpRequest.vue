<script setup lang="ts">
// import { ref } from "vue";
import router from "@/router";

const props = defineProps(["reminder"]);
const emit = defineEmits(["removeNotification"]);

// let username = ref<Array<Record<string, string>>>([]);

// async function getUsername() {
//   try {
//     username.value = await fetchy(`/api/users/${props.task.requester}`, "GET", {});
//   } catch (_) {
//     return;
//   }
// }

// onBeforeMount(async () => {
//   await getUsername();
// });
async function goToTask() {
  router.push(`/task/${props.reminder.contentId}`);
}
</script>

<template>
  <div class="taskNotification" @click="goToTask">
    <font-awesome-icon icon="x" size="lg" class="icon" @click.stop="emit('removeNotification', props.reminder._id)" />
    <p>Help request from [username] on [task]!</p>
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
