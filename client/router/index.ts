import { storeToRefs } from "pinia";
import { createRouter, createWebHistory } from "vue-router";

import { useUserStore } from "@/stores/user";
import ChallengesView from "../views/ChallengesView.vue";
import CreateTaskView from "../views/CreateTaskView.vue";
import EditProfileView from "../views/EditProfileView.vue";
import RequestsView from "../views/FriendRequestsView.vue";
import FriendsView from "../views/FriendsView.vue";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import MessageView from "../views/MessageView.vue";
import NotFoundView from "../views/NotFoundView.vue";
import ProfileView from "../views/ProfileView.vue";
import RegisterView from "../views/RegisterView.vue";
import SettingView from "../views/SettingView.vue";
import SettingsView from "../views/SettingsView.vue";
import TaskView from "../views/TaskView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Home",
      component: HomeView,
    },
    {
      path: "/profile/edit",
      name: "Edit Profile",
      component: EditProfileView,
      meta: { requiresAuth: true },
    },
    {
      path: "/tasks",
      name: "Task",
      component: TaskView,
      // meta: { requiresAuth: true },
    },
    {
      path: "/create",
      name: "Create",
      component: CreateTaskView,
      meta: { requiresAuth: true },
    },
    {
      path: "/setting",
      name: "Settings",
      component: SettingView,
      meta: { requiresAuth: true },
    },
    {
      path: "/settings",
      name: "Settings",
      component: SettingsView,
      meta: { requiresAuth: true },
    },
    {
      path: "/login",
      name: "Login",
      component: LoginView,
      meta: { requiresAuth: false },
      beforeEnter: (to, from) => {
        const { isLoggedIn } = storeToRefs(useUserStore());
        if (isLoggedIn.value) {
          return { name: "Settings" };
        }
      },
    },
    {
      path: "/register",
      name: "Register",
      component: RegisterView,
      meta: { requiresAuth: false },
      beforeEnter: (to, from) => {
        const { isLoggedIn } = storeToRefs(useUserStore());
        if (isLoggedIn.value) {
          return { name: "Settings" };
        }
      },
    },
    {
      path: "/profile/:user",
      name: "Profile",
      component: ProfileView,
      meta: { requiresAuth: true },
      props: true,
    },
    {
      path: "/challenges",
      name: "Challenges",
      component: ChallengesView,
      meta: { requiresAuth: true },
    },
    {
      path: "/friends",
      name: "Friends",
      component: FriendsView,
      meta: { requiresAuth: true },
    },
    {
      path: "/requests",
      name: "Requests",
      component: RequestsView,
      meta: { requiresAuth: true },
    },
    {
      path: "/messages/:username?",
      name: "Messages",
      component: MessageView,
      meta: { requiresAuth: true },
    },
    {
      path: "/kudos",
      name: "Kudos",
      component: NotFoundView,
      meta: { requiresAuth: true },
    },
    {
      path: "/:catchAll(.*)",
      name: "not-found",
      component: NotFoundView,
    },
  ],
});

/**
 * Navigation guards to prevent user from accessing wrong pages.
 */
router.beforeEach((to, from) => {
  const { isLoggedIn } = storeToRefs(useUserStore());

  if (to.meta.requiresAuth && !isLoggedIn.value) {
    return { name: "Login" };
  }
});

export default router;
