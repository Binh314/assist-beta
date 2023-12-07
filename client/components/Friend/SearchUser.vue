<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const username = ref("");
const matchingUsers = ref<Array<Record<string, string>>>([]);

async function getMatchingUsers(prefix: string) {
  if (prefix === "") {
    matchingUsers.value = [];
    return;
  }
  let userResults;
  try {
    userResults = await fetchy(`/api/users/matching/${prefix}`, "GET");
  } catch {
    return;
  }
  matchingUsers.value = userResults;
}
</script>

<template>
  <section>
    <div class="search">
      <div class="searchbar">
        <input id="username" type="text" v-model="username" @input="getMatchingUsers(username)" placeholder="Search by username" autocomplete="off" />
        <span class="material-symbols-outlined" @click="$router.push(`/profile/${username}`)">search</span>
      </div>
    </div>
    <div class="searchresults" v-if="matchingUsers.length > 0">
      <div v-for="user in matchingUsers" :key="user._id">
        <div class="resultentry" @click="$router.push(`/profile/${user.username}`)">
          <span>{{ user.username }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
section {
  width: 40%;
  margin: 0 auto;
}
.searchbar {
  display: flex;
  justify-content: center;
  gap: 0.5em;
  margin: 1em 0 0 0;
  align-items: center;
}

input {
  width: 100%;
  padding: 0.4em;
}

.searchresults {
  /* position: absolute; */
  width: 100%;
  margin: 0 auto;
  background-color: var(--base-bg);
  border: 1px solid #ccc;
  box-shadow: 0 2px 5px var(--base-bg);
  z-index: 1; /* Ensure the results are above other content */
}

.resultentry {
  padding: 0.5em;
  cursor: pointer;
}

.resultentry:hover {
  background-color: var(--light-pink);
}

.material-symbols-outlined:hover {
  cursor: pointer;
}
</style>
