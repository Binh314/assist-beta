<script setup lang="ts">
import KudosComponent from "@/components/Kudos/KudosComponent.vue";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());

const loaded = ref(false);
let kudos = ref<Array<Record<string, string>>>([]);

async function getKudos() {
  const receiver = await fetchy(`/api/users/${currentUsername.value}`, "GET");
  const id = receiver._id;
  let kudosResults;
  try {
    kudosResults = await fetchy(`/api/kudo/received/${id}`, "GET");
  } catch (_) {
    console.log("This is failing to get kudos");
    return;
  }
  kudos.value = kudosResults.reverse();
}

onBeforeMount(async () => {
  await getKudos();
  loaded.value = true;
});
</script>

<template>
  <main>
    <h1>kudos</h1>
    <section class="kudos" v-if="loaded && kudos.length !== 0">
      <div v-for="kudo in kudos" :key="kudo._id">
        <KudosComponent :kudo="kudo" />
      </div>
    </section>
    <p v-else-if="loaded">No kudos found.</p>
    <p v-else>Loading...</p>
  </main>
</template>

<style scoped>
main {
  margin-left: 1.5em;
}
section {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2em;
  /* grid-auto-rows: minmax(5px, auto); */
  width: 95%;
  padding: 0 1em;
  /* justify-content: center; */
}

p {
  margin-left: 1em;
}

h1 {
  margin-left: 0.5em;
  margin-top: 1em;
  display: flex;
  align-items: center;
}

.icon {
  margin-left: 0.5em;
  display: none;
}

.icon:hover {
  cursor: pointer;
}
</style>
