<script setup lang="ts">
import { formatDatepick, formatTimepick, toDateString } from "@/utils/formatDate";
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["task"]);
const emit = defineEmits(["refreshTasks", "editTask"]);

const title = ref(props.task.title);
const description = ref(props.task.description);
const deadlineDate = ref(formatDatepick(props.task.deadline))
const deadlineTime = ref(formatTimepick(props.task.deadline))
const files = ref<Array<string>>(props.task.files);

const editTask = async (title: string, description: string, deadlineDate: string, deadlineTime: string, fs: string[] = []) => {
  try {

    // filter out empty strings
    const files = fs.filter(e=>e);

    const deadline = toDateString(deadlineDate + " " + deadlineTime);
    console.log(deadline)

    await fetchy(`/api/tasks/${props.task._id}/edit`, "PATCH", {
      body: { title, description, deadline, files },
    });
  } catch (_) {
    return;
  }
  emit("editTask")
  emit("refreshTasks");
};






</script>

<!-- Source for Preventing Submission on Enter:
  https://stackoverflow.com/questions/31070479/prevent-form-submitting-when-pressing-enter-from-a-text-input-using-vue-js -->

<template>
  <form @submit.prevent="editTask(title, description, deadlineDate, deadlineTime, files)">
    <label for="title"> Title </label>
    <input id="title" v-model="title" placeholder="task title" required @keypress.enter.prevent autocomplete="off"/> 

    <label for="description">
      Description
    </label>
    <textarea id="description" v-model="description" placeholder="task description"> </textarea>

    <label for="startTime"> 
      <!-- <font-awesome-icon :icon="['fas', 'calendar']" size="lg" class="icon" />  -->
      Deadline Date
    </label>
    <input type="date" v-model="deadlineDate" id="deadlineDate" name="deadline-date" required @keypress.enter.prevent autocomplete="off"/>
    <label for="endTime"> 
      Deadline Time
    </label>
    <input type="time" v-model="deadlineTime" id="deadlineTime" name="deadline-time" required @keypress.enter.prevent autocomplete="off"/>

    
    <br>
    <menu>
      <li><button type="submit" class="btn-small pure-button-primary pure-button">Save</button></li>
      <li><button class="btn-small pure-button button-error" @click.prevent="emit('editTask')">Cancel</button></li>
    </menu>
  </form>
</template>

<style scoped>


.photo{
  height: 50vh;
  max-width: 100%;
  border-radius: 1em;
  object-fit: scale-down;
}


menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 1em;
  padding: 0;
  margin: 0;
  align-items: center
}
.icon {
  width: 1em;
}

label {
  margin-top: 1em;
}

form {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

textarea {
  font-family: inherit;
  font-size: inherit;
  height: 6em;
  padding: 0.5em;
  border-radius: 4px;
  resize: none;
}
</style>
