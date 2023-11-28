<script setup lang="ts">
import TagsInput from "@/components/Tag/TagsInput.vue";
import { formatDate, formatDatepick, formatTaskDate, formatTime, toDateString } from "@/utils/formatDate";
import { ref } from "vue";
import { useToastStore } from "../../stores/toast";
import { fetchy } from "../../utils/fetchy";


const title = ref("");
const location = ref("");
const description = ref("");
const startTime = ref(formatDatepick(new Date()))
const endTime = ref(formatDatepick(new Date()))
const availability = ref<Array<Record<string, string>>>([]);
const tags = ref<Array<string>>(['',]);
const files = ref<Array<string>>(['',]);
const emit = defineEmits(["refreshTasks"]);

const createTask = async (title: string, description: string, availability: Record<string, string>[] = [], ts: string[], fs: string[] = []) => {
  try {

    // filter out empty strings
    const tags = ts.filter(e=>e);
    const files = fs.filter(e=>e);

    await fetchy("/api/tasks", "POST", {
      body: { title, description, availability, tags, files },
    });
  } catch (_) {
    return;
  }
  emit("refreshTasks");
  emptyForm();
};


function addAvailability(startDate: string, endDate: string) {
  if (Date.parse(startDate) > Date.parse(endDate)) {
      useToastStore().showToast({ message: "End time needs to be later than start time.", style: "error" });
      return;
    }
    
    const startTime = toDateString(startDate);
    const endTime = toDateString(endDate);

    availability.value.push({start: startTime, end: endTime});
}


const emptyForm = () => {
  title.value = "";
  location.value = "";
  description.value = "";
  startTime.value = formatDatepick(new Date());
  endTime.value = formatDatepick(new Date());
  availability.value = [];
  tags.value.length = 0;
  files.value.length = 0;
};



</script>

<!-- Source for Preventing Submission on Enter:
  https://stackoverflow.com/questions/31070479/prevent-form-submitting-when-pressing-enter-from-a-text-input-using-vue-js -->

<template>
  <form @submit.prevent="createTask(title, description, availability, tags, files)">
    <label for="title"> Title </label>
    <input id="title" v-model="title" placeholder="task title" required @keypress.enter.prevent autocomplete="off"/> 

    <label for="description">
      Description
    </label>
    <textarea id="description" v-model="description" placeholder="description of task"> </textarea>

    <label for="tagsInput">
      <!-- <font-awesome-icon icon="tags" size="lg" class="icon" /> -->
      Tags
    </label>
    <TagsInput id="tagsInput" :initTags="tags" />

    <label for="availInput">Availability</label>
    <div id="availInput">
      <label for="startTime"> 
        <!-- <font-awesome-icon :icon="['fas', 'calendar']" size="lg" class="icon" />  -->
        Start Time
      </label>
      <input type="datetime-local" v-model="startTime" id="startTime" name="start-time" required @keypress.enter.prevent autocomplete="off"/>
      <label for="endTime"> 
        <!-- <font-awesome-icon :icon="['fas', 'calendar']" size="lg" class="icon" />  -->
        End Time
      </label>
      <input type="datetime-local" v-model="endTime" id="endTime" name="end-time" required @keypress.enter.prevent autocomplete="off"/>
      <button @click.prevent="addAvailability(startTime, endTime)">Add Availability</button>
    </div>
    <div v-for="interval in availability">
    <p class = "time" v-if="formatDate(new Date(interval.start)).split(', ')[0] === formatDate(new Date(interval.end)).split(', ')[0]">
    <font-awesome-icon :icon="['fas', 'calendar']" size="lg" class="icon" /> {{ formatTaskDate(new Date(interval.start)) }} &ndash;  {{ formatTime(new Date(interval.end)) }}
    </p>
    <p class = "time" v-else>
      <font-awesome-icon :icon="['fas', 'calendar']" size="lg" class="icon" /> {{ formatTaskDate(new Date(interval.start)) }} &ndash;  {{ formatTaskDate(new Date(interval.end)) }}
    </p>
    </div>
    
    <br>
    <menu>
      <li><button type="submit" class="pure-button-primary pure-button">Create Task</button></li>
      <li><button class="btn-small pure-button" @click.prevent="emit('refreshTasks')">Cancel</button></li>
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
