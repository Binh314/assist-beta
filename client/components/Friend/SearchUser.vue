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
    <div class="searchbar">
      <span class="material-symbols-outlined">search</span>
      <input id="username" type="text" v-model="username" @input="getMatchingUsers(username)" placeholder="Search by username" />
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
  position: absolute;
  width: 40%;
  margin: 0 auto;
  background-color: lightgray;
  border: 1px solid #ccc;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  z-index: 1; /* Ensure the results are above other content */
}

.resultentry {
  padding: 0.5em;
  cursor: pointer;
}

.resultentry:hover {
  background-color: gray;
}
</style>
