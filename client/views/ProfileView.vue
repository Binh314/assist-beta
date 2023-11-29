<script setup lang="ts">
import { ref } from "vue";

const username = ref("Tester")
const kudos = ref(9)
const profilePicture = ref("https://firebasestorage.googleapis.com/v0/b/interlives-c40b5.appspot.com/o/auth%2FBruno%20Mars.jpg?alt=media&token=a86cc383-ecb0-44f2-80c8-9232b44cd166")

</script>
<template>
    <img :src=profilePicture>
</template>