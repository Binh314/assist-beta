<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import MessagesComponent from "../components/Message/MessagesComponent.vue";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main>
    <MessagesComponent/>
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}


</style>
