import { defineStore } from "pinia";
import { computed, ref } from "vue";

import { BodyT, fetchy } from "@/utils/fetchy";

export const useUserStore = defineStore(
  "user",
  () => {
    const currentUsername = ref("");
    const currentProfilePicture = ref("");

    const isLoggedIn = computed(() => currentUsername.value !== "");

    const resetStore = () => {
      currentUsername.value = "";
      currentProfilePicture.value = "";
    };

    const createUser = async (username: string, password: string, picture: string) => {
      await fetchy("/api/users", "POST", {
        body: { username, password, picture },
      });
    };

    const loginUser = async (username: string, password: string) => {
      await fetchy("/api/login", "POST", {
        body: { username, password },
      });
    };

    const authUser = async (username: string, password: string) => {
      try {
        const response = await fetchy('/api/auth', 'POST', {
          body: { username: username, password: password }
        });
        console.log(`This is auth response: `,response)
        return response.authentication;
      } catch (error) {
        console.log('Encounter Error')
        return false;
      }
    }

    const updateSession = async () => {
      try {
        const { username } = await fetchy("/api/session", "GET", { alert: false });
        currentUsername.value = username;
        
        const response = await fetchy(`/api/users/${currentUsername.value}`,"GET")
        currentProfilePicture.value = response.picture;


      } catch {
        currentUsername.value = "";
        currentProfilePicture.value = "";
      }

    };

    const logoutUser = async () => {
      await fetchy("/api/logout", "POST");
      resetStore();
    };

    const updateUser = async (patch: BodyT) => {
      await fetchy("/api/users", "PATCH", { body: { update: patch } });
    };

    const deleteUser = async () => {
      await fetchy("/api/users", "DELETE");
      resetStore();
    };

    return {
      currentUsername,
      currentProfilePicture,
      isLoggedIn,
      createUser,
      loginUser,
      updateSession,
      logoutUser,
      updateUser,
      deleteUser,
      authUser
    };
  },
  { persist: true },
);
