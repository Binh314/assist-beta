<script setup lang="ts">
import HelpOffer from "@/components/Task/HelpOffer.vue";
import HelpRequest from "@/components/Task/HelpRequest.vue";
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());

function login() {
  void router.push({ name: "Login" });
}

async function signup() {
  void router.push({ name: "Register" });
}
</script>

<template>
  <main>
    <section>
      <div v-if="isLoggedIn" class="page landing">
        <img src="@/assets/images/tempChallenge.png" class="progress" />
        <p>[challenge] - 64% complete</p>
        <p class="link">view active challenges</p>
        <div class="notifications">
          <div class="offers">
            <HelpOffer />
            <HelpOffer />
            <HelpOffer />
          </div>
          <div class="requests">
            <HelpRequest />
            <HelpRequest />
            <HelpRequest />
          </div>
        </div>
      </div>

      <div v-else class="page">
        <div class="content" id="content-1">
          <img src="@/assets/images/homepage.png" />
          <div class="text">
            Ever needed or wanted assistance but not known which of your friends to ask? Or been concerned you'd be putting a burden on them by asking? With Assist, you can input a task, and we'll
            help you get the help you're looking for.
          </div>
          <a href="#content-3">
            <img class="icon" src="@/assets/images/scroll_down.png" />
          </a>
        </div>
        <!-- <div class="content" id="content-2">
          <img src="@/assets/images/homepage_help.png" />
          <div class="text">^ placeholder image; insert blurb that conveys value of using Assist</div>
          <a href="#content-3">
            <img class="icon" id="content-2-icon" src="@/assets/images/scroll_down.png" />
          </a>
        </div> -->
        <div class="content" id="content-3">
          <img src="@/assets/images/temp_logo.png" />
          <div>
            <button @click="signup">Sign up</button>
            <button @click="login">Login</button>
          </div>
          <a href="#top">
            <img class="icon" id="content-3-icon" src="@/assets/images/top_of_page.png" />
          </a>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}

p {
  margin-top: 0.5em;
  margin-bottom: 0;
}

.link {
  color: #b7c2c8;
  background-color: white;
  margin-bottom: 0.5em;
}

.link:hover {
  cursor: pointer;
}

.notifications {
  display: flex;
  flex-direction: row;
  margin-top: 1.5em;
  margin-bottom: 1em;
}

.offers {
  display: flex;
  flex-direction: column;
  margin-right: 5em;
}

.requests {
  display: flex;
  margin-left: 5em;
  flex-direction: column;
}

.landing {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.content {
  display: block;
  padding-top: 2em;
  text-align: center;
  width: 100%;
  align-items: center;
  justify-content: center;
}

#content-2 {
  padding-top: 10em;
}

#content-2-icon {
  padding-top: 5em;
}

#content-3 {
  padding-top: 4em;
}

#content-3-icon {
  padding-top: 1em;
  padding-bottom: 2em;
}

.progress {
  max-width: 15em;
  margin-top: 2em;
}

img {
  max-width: 45%;
}

.text {
  margin-top: 0.5em;
  margin-left: 30%;
  width: 40%;
  text-align: center;
  line-height: 1.5em;
}

.icon {
  width: 5%;
}

.icon:hover {
  cursor: pointer;
}

button {
  margin-left: 2em;
  margin-right: 2em;
  margin-top: 1em;
}
</style>
