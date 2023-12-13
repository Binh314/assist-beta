<script setup lang="ts">
import AboutComponent from "@/components/Landing/AboutComponent.vue";
import HelpOffer from "@/components/Task/HelpOffer.vue";
import HelpRequest from "@/components/Task/HelpRequest.vue";
import TaskComponent from "@/components/Task/TaskComponent.vue";
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

const task = ref<Record<string, string>>();
const showingTask = ref(false);

function login() {
  console.log(`login clicked`);
  void router.push({ name: "Login" });
}

async function signup() {
  console.log(`register clicked`);

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
  await getTaskReminders();
}

async function showTask(id: string) {
  try {
    task.value = await fetchy(`/api/tasks/id/${id}`, "GET");
    showingTask.value = true;
  } catch (_) {
    return;
  }
}

async function refreshTask() {
  if (task.value) showTask(task.value._id);
}

async function closeShowTask() {
  showingTask.value = false;
}

onBeforeMount(async () => {
  if (isLoggedIn.value) {
    await getChallenges();
    await getTaskReminders();
  }
});
</script>

<template>
  <main>
    <section>
      <div v-if="isLoggedIn" class="page landing">
        <AboutComponent />
        <hr />
        <div class="challenges">
          <h3 style="margin-top: 0">Challenges:</h3>
          <div v-for="challenge in challenges" :key="challenge._id">
            <!-- <progress value="progress[challenge]" max="5"></progress> -->
            <p class="challenge">{{ challenge.description }}</p>
          </div>
          <p class="link" @click="viewChallenges">view more details</p>
        </div>
        <hr />
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
              <HelpRequest :reminder="reminder" @removeNotification="removeNotification" @showTask="showTask" />
            </div>
          </div>
          <div class="requests" v-else>
            <p class="reminderPlaceholder">You have no task request reminders.</p>
          </div>
        </div>
      </div>

      <div v-else class="page not-login">
        <div class="auth-container">
          <div class="column title-container">
            <span class="title">Welcome to Assist </span>
            <span class="description">A supportive community that matches individuals who need help with those eager to offer it in their areas of expertise or interest.</span>
          </div>
          <div class="button-group">
            <button class="btn-container" @click="signup">Sign up</button>
            <button class="btn-container" @click="login">Login</button>
          </div>
        </div>
      </div>
      <div v-if="showingTask" class="modal-overlay">
        <div class="modal-content task">
          <div class="closeButton">
            <font-awesome-icon :icon="['fas', 'x']" @click="closeShowTask" size="lg" />
          </div>
          <TaskComponent :task="task" @refreshTasks="refreshTask" />
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
hr {
  width: 90%;
  color: var(--light-pink);
  margin-top: 5vh;
  margin-bottom: 5vh;
}

.closeButton {
  display: flex;
  justify-content: flex-end;
}

.closeButton:hover {
  cursor: pointer;
}

.task {
  line-height: 2em;
}
.description {
  font-size: 18px;
  color: var(--deep-purple);
  background-color: rgb(229, 204, 244, 0.9);
  padding: 1%;
}
.auth-container {
  display: flex;
  flex-direction: column; /* Stack items vertically */
  align-items: center; /* Center items horizontally */
  justify-content: center; /* Center items vertically if there's extra space */
  height: 100%; /* Take full height of the parent */
  width: 100vw;
}

.title {
  font-size: 73px;
  color: var(--deep-purple);
  font-weight: 700;
  background-color: rgb(229, 204, 244, 0.9);
  border-radius: 10px;
  padding: 1%;
}

.title-container {
  margin-bottom: 55vh;
}

.btn-container {
  background-color: var(--light-pink);
  border: var(--dark-purple) solid 4px;
  border-radius: 20px;
  color: var(--deep-purple);
  padding: 3%;
  font-size: 3vh;
  min-width: 8vw;
  z-index: 2;
  font-weight: 550;
}

.btn-container:hover {
  background-color: var(--purple);
  border: var(--deep-purple) solid 4px;
  z-index: 2;
}
/* 
.not-login::before {
  content: '';
  display: block;
  position: absolute;
  height: 91.2%;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.3); 
  z-index: 1; 
} */

.not-login {
  background-image: url(../assets/images/background.jpeg);
  height: 100vh;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  align-items: center;
  justify-content: center;
  display: flex;
}
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
  color: (--purple);
  background-color: white;
  /* margin-top: 1.25em;
  margin-bottom: 0.5em; */
  padding: 0.5em;
  border-radius: 5px;
}

.link:hover {
  color: --deep-purple;
  background-color: var(--light-pink);
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

.taskNotification {
  position: relative;
  display: flex;
  width: 30em;
  height: 5em;
  background-color: #a080e3;
  color: white;
  text-align: center;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5em;
}
</style>
