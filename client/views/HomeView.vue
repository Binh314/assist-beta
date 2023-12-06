<script setup lang="ts">
import HelpOffer from "@/components/Task/HelpOffer.vue";
import HelpRequest from "@/components/Task/HelpRequest.vue";
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
const challenges = ref<Array<Record<string, string>>>([]);
const progress = ref();
const requestReminders = ref<Array<Record<string, string>>>([]);
const offerReminders = ref<Array<Record<string, string>>>([]);

function login() {
  void router.push({ name: "Login" });
}

async function signup() {
  void router.push({ name: "Register" });
}

async function viewChallenges() {
  void router.push({ name: "Challenges" });
}

async function getChallenges() {
  try {
    challenges.value = await fetchy(`/api/challenges`, "GET");
    // for (const challenge in challenges) {
    //   const num = await fetchy(`/api/challenges/${challenge}/progress`, "GET");
    //   if (num) {
    //     progress.value[challenge] = num;
    //   }
    // }
  } catch (_) {
    console.log(_);
    return;
  }
}

async function getTaskReminders() {
  try {
    requestReminders.value = await fetchy(`/api/reminders/all/taskRequest`, "GET");
    offerReminders.value = await fetchy(`/api/reminders/all/taskOffer`, "GET");
  } catch (_) {
    console.log(_);
    return;
  }
}

async function removeNotification(id: string) {
  try {
    await fetchy(`/api/reminders/${id}`, "DELETE");
  } catch (_) {
    console.log(_);
    return;
  }
  getTaskReminders();
}

onBeforeMount(async () => {
  await getChallenges();
  await getTaskReminders();
});
</script>

<template>
  <main>
    <section>
      <div v-if="isLoggedIn" class="page landing">
        <div class="challenges">
          <h3>Challenges:</h3>
          <div v-for="challenge in challenges" :key="challenge._id">
            <!-- <progress value="progress[challenge]" max="5"></progress> -->
            <p class="challenge">{{ challenge.description }}</p>
          </div>
          <p class="link" @click="viewChallenges">view more details</p>
        </div>
        <div class="notifications">
          <div class="offers" v-if="offerReminders.length > 0">
            <div v-for="reminder in offerReminders">
              <HelpOffer :reminder="reminder" @removeNotification="removeNotification" />
            </div>
          </div>
          <div class="offers" v-else>
            <p class="reminderPlaceholder">You have no task offer reminders.</p>
          </div>
          <div class="requests" v-if="requestReminders.length > 0">
            <div v-for="reminder in requestReminders">
              <HelpRequest :reminder="reminder" @removeNotification="removeNotification" />
            </div>
          </div>
          <div class="requests" v-else>
            <p class="reminderPlaceholder">You have no task request reminders.</p>
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
.reminderPlaceholder {
  width: 30em;
  text-align: center;
}

h1 {
  text-align: center;
}

h3 {
  margin-top: 5em;
}

p {
  margin-top: 0.5em;
  margin-bottom: 0;
}

.challenge {
  margin-top: 1em;
}

.link {
  color: #b7c2c8;
  background-color: white;
  margin-top: 1.25em;
  margin-bottom: 0.5em;
}

.link:hover {
  cursor: pointer;
}

.challenges {
  text-align: center;
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
