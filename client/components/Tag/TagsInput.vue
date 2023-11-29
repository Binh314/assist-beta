<script setup lang="ts"  crossorigin="anonymous"> 
// src="https://kit.fontawesome.com/40828c6ea5.js"
import { ref } from "vue";

const emit = defineEmits(["updateTags"]);
const props = defineProps(["initTags"]);

const tags = ref<Array<string>>(props.initTags);

function inputWidth(i: number) {
  if (tags.value[i].length === 0) return 10 + "em";
  return Math.max(tags.value[i].length, 8) * 5/8 + "em"; 
}


function addTag() {
  tags.value.push('');
  console.log(tags.value);
  if (document.activeElement) (document.activeElement as HTMLElement).blur();
  emit("updateTags", tags.value);
}

function removeTag(i: number) {
  tags.value.splice(i, 1);
  console.log(tags.value);
  emit("updateTags", tags.value);
}


// onBeforeMount(() => {
//   console.log(props.initTags);
//   tags.value.push(...props.initTags);
// });

</script>


<template>
  <div>
    <span v-for="(tag, index) in tags">
      <input v-model="tags[index]" class = "tagInput" @blur="emit('updateTags', tags)"  :placeholder="`click to enter tag`"
      :style="{ width: inputWidth(index) }" @keyup.enter="addTag" @keypress.enter.prevent> 
      <font-awesome-icon :ref="`input${index}`" :icon="['fas', 'square-xmark']" size="2xl" @click="removeTag(index)" class="removeIcon"/>
    </span>
    <font-awesome-icon :icon="['far', 'square-plus']" size="2xl" @click="addTag" class="addIcon"/>
  </div>
</template>

<style scoped>

input {
  padding: .25em;
}

span {
  line-height: 2em;
}

.addIcon {
  margin-left: 0.5em;
}

h3 {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}


.removeIcon {
  gap: 0px;
  margin-right: 0.5em;
}

.tagInput {
  gap: 0px;
  background-color: lightgrey;
  font-weight: bold;
  text-align: center;
  max-width: 85%;
}

.tagInput:focus {
  gap: 0px;
  background-color: white;
  font-weight: normal;
}

</style>
