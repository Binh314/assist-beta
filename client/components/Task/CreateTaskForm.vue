<script setup lang="ts">
import TagsInput from "@/components/Tag/TagsInput.vue";
import { formatDatepick, formatTimepick, toDateString } from "@/utils/formatDate";
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const title = ref("");
const location = ref("");
const description = ref("");
const deadlineDate = ref(formatDatepick(new Date()));
const deadlineTime = ref(formatTimepick(new Date()));
const availability = ref<Array<Record<string, string>>>([]);
const tags = ref<Array<string>>([""]);
const files = ref<Array<string>>([""]);
const emit = defineEmits(["refreshTasks"]);

const createTask = async (title: string, description: string, deadlineDate: string, deadlineTime: string, ts: string[], fs: string[] = []) => {
  try {
    // filter out empty strings
    const tags = ts.filter((e) => e);
    const files = fs.filter((e) => e);

    const deadline = toDateString(deadlineDate + " " + deadlineTime);
    console.log(deadline);

    await fetchy("/api/tasks", "POST", {
      body: { title, description, deadline, tags, files },
    });
  } catch (_) {
    return;
  }
  emit("refreshTasks");
  emptyForm();
};

const emptyForm = () => {
  title.value = "";
  location.value = "";
  description.value = "";
  deadlineDate.value = formatDatepick(new Date());
  deadlineTime.value = formatTimepick(new Date());
  tags.value.length = 0;
  files.value.length = 0;
};
</script>

<!-- Source for Preventing Submission on Enter:
  https://stackoverflow.com/questions/31070479/prevent-form-submitting-when-pressing-enter-from-a-text-input-using-vue-js -->

<template>
  <form @submit.prevent="createTask(title, description, deadlineDate, deadlineTime, tags, files)">
    <label for="title"> Title </label>
    <input class="endCategory" id="title" v-model="title" placeholder="task title" required @keypress.enter.prevent autocomplete="off" />

    <label for="description"> Description </label>
    <textarea class="endCategory" id="description" v-model="description" placeholder="task description"> </textarea>

    <label for="tagsInput">
      <!-- <font-awesome-icon icon="tags" size="lg" class="icon" /> -->
      Tags
    </label>
    <TagsInput class="endCategory" id="tagsInput" :initTags="tags" />

    <label for="startTime">
      <!-- <font-awesome-icon :icon="['fas', 'calendar']" size="lg" class="icon" />  -->
      Deadline Date
    </label>
    <input type="date" v-model="deadlineDate" id="deadlineDate" name="deadline-date" required @keypress.enter.prevent autocomplete="off" />
    <label for="endTime"> Deadline Time </label>
    <input type="time" v-model="deadlineTime" id="deadlineTime" name="deadline-time" required @keypress.enter.prevent autocomplete="off" />

    <br />
    <menu>
      <li><button type="submit" class="pure-button-primary pure-button">Create Task</button></li>
      <li><button class="pure-button" @click.prevent="emit('refreshTasks')">Cancel</button></li>
    </menu>
  </form>
</template>

<style scoped>
.photo {
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
  align-items: center;
}
.icon {
  width: 1em;
}

label {
  font-weight: bold;
}

.endCategory {
  margin-bottom: 1em;
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

button {
  background-color: var(--purple);
  color: white;
}

button:hover {
  background-color: var(--dark-purple);
  color: white;
}
</style>
