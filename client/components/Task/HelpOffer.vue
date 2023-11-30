<script setup lang="ts">
// import { ref } from "vue";

const props = defineProps(["task"]);
const emit = defineEmits(["removeNotification"]);

// let username = ref<Array<Record<string, string>>>([]);

// async function getUsername() {
//   try {
//     username.value = await fetchy(`/api/users/${props.task.assisters[-1]}`, "GET", {});
//   } catch (_) {
//     return;
//   }
// }

// onBeforeMount(async () => {
//   await getUsername();
// });
</script>

<template>
  <div class="taskNotification">
    <font-awesome-icon icon="x" size="lg" class="icon" @click="emit('removeNotification', props.task._id)" />
    <p>Help offer from [username] on [task]!</p>
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
</style>
