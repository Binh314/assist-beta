<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["kudo"]);

const giver = ref<Record<string, string>>();
const giverUsername = ref("");

async function getGiver() {
  giver.value = await fetchy(`/api/users/id/${props.kudo.giver}`, "GET");
  giverUsername.value = giver.value ? giver.value.username : "";
}

onBeforeMount(async () => {
  try {
    await getGiver();
  } catch {
    console.log("Error in getting giver of kudos");
    return;
  }
});
</script>

<template>
  <div class="kudo">
    <h3 class="giver">
      <span class="name"> {{ giverUsername }} </span>
    </h3>
    <p>{{ props.kudo.message }}</p>
  </div>
</template>

<style scoped>
.kudo {
  padding: 1em;
  height: 10em;
  background-color: var(--base-bg);
  border-radius: 1em;
  overflow-y: auto;
}

p {
  padding-top: 0.5em;
}
.confirmOptions {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}

.long-input {
  width: 40em;
  height: 3em;
  margin-top: 1em;
  margin-bottom: 1em;
  padding-left: 1em;
}

.confirmMenu {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.requester {
  display: flex;
  flex-direction: row;
  align-items: center;
}

img {
  object-fit: cover;
  height: 2em;
  aspect-ratio: 1;
  margin-right: 0.5em;
  cursor: pointer;
  border-radius: 1em;
}

.profile:hover {
  cursor: pointer;
  text-decoration: underline;
}

.clickable:hover {
  cursor: pointer;
}

.selectedAssistant {
  font-weight: bold;
}

.assisterButton {
  margin-right: 1em;
}

label {
  padding-top: 1em;
}
.icon {
  width: 1em;
}

.messageIcon {
  margin-left: 0.5em;
}

.messageIcon:hover {
  cursor: pointer;
}

.dropdownButton {
  width: 10em;
}

.host {
  font-weight: normal;
}

h2,
h3 {
  margin-top: 0;
  margin-bottom: 0;
}
p {
  margin: 0em;
}

.photo {
  height: 50vh;
  max-width: 100%;
  border-radius: 1em;
  object-fit: scale-down;
}

.title {
  font-weight: bold;
}

.options {
  display: flex;
  justify-content: space-between;
}

menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 1em;
  padding: 0;
  margin: 0;
}

.timestamp {
  display: flex;
  justify-content: flex-end;
  font-size: 0.9em;
  font-style: italic;
}

.base {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.base article:only-child {
  margin-left: auto;
}
</style>
