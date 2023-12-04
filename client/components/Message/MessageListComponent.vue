<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import ProfileMessageComponent from "../Message/ProfileMessageComponent.vue";
// import router from "../../router";
const { isLoggedIn, currentUsername } = storeToRefs(useUserStore());

// const currentRoute = ref(useRoute());
// const currentRouteName = computed(() => currentRoute.value.name);

const props = defineProps(["messaging"]);
const emit = defineEmits(["sendMessage"]);
const loaded = ref(false);
const componentKey = ref(1);
let profile = ref<Record<string, string>>();
let editing = ref("");
const username = ref("");

const sendMessage = async () => {
  emit("sendMessage");
}

function updateEditing(id: string) {
  editing.value = id;
}

onBeforeMount(async () => {

});


</script>

<template>
  <section>
    <div class="preview" v-for="user in messaging">
      <ProfileMessageComponent :username="user" @sendMessage="sendMessage"/>
    </div>
  </section>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  gap: 1em;
}


section,
p,
.row {
  margin: 0 auto;
  /* max-width: 60em; */
}

section {
  overflow-y: scroll;
  height: 71vh;
}

.preview {
  margin-bottom: 1em;
}

article {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

.profiles {
  padding: 1em;
}

.formArea {
  padding: 1em;
}

.row {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  padding: 1em
}
</style>
