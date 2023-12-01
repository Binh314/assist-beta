<script setup lang="ts">
import { ref, defineEmits } from 'vue';
import router from "@/router";

const emit = defineEmits(["selection"]);

function updateRoute(newRoute:string){
    router.push(newRoute);
    emit("selection");
}
</script>

<template>
    <aside class="nav-menu" >
      <div class = "column">
        <button class = "nav-selection" @click = "updateRoute('/tasks')">Tasks</button>
        <button class = "nav-selection" @click = "updateRoute('/friends')">Friends</button>
        <button class = "nav-selection" @click = "updateRoute('/messages')">Messages</button>
        <button class = "nav-selection" @click = "updateRoute('/challenges')">Challenges</button>
        <button class = "nav-selection" @click = "updateRoute('/profile')">Profile</button>
        <button class = "nav-selection" @click = "updateRoute('/kudos')">Kudos</button>
      </div>
    </aside>
  </template>
  

<style scoped>
.nav-menu{
    position: fixed;
    top: 7vh;
    left: 0;
    width: 100%;
    height: object-fit;
    background-color: var(--blue-gray);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000; /* Ensure it's above other content */
}


.nav-selection{
  background-color: transparent;
  border: none;
  color: white;
  font-size: 2.5vh;
  padding: 1vh;
  font-weight: 600;
}

.nav-selection:hover{
  background-color: var(--deep-purple);
  width: 10000%;
  color: white;
}

</style>

