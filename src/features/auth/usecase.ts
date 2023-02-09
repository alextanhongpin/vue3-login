import { inject, provide, readonly, onMounted, ref } from "vue";
import type { InjectionKey } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Routes } from "@/adapter/route";
import { getToken, setToken } from "@/features/token";
import { postAuthorize, postLogin } from "@/features/auth/service";
import { sleep } from "@/types/time";
import type { User } from "@/types/domain";

// The state can be represented as `state = success | error | loading`,
// and only one state is allowed at a time.
type AuthState = {
  user?: User;
  error?: Error;
  loading?: boolean;
};

type AuthAction = {
  state: AuthState;
  login(name: string): void;
  logout(): void;
};

export const AUTH_KEY = Symbol() as InjectionKey<AuthAction>;

export function useAuth() {
  return inject(AUTH_KEY);
}

export function provideAuth() {
  const router = useRouter();
  const route = useRoute();

  const state = ref<AuthState>({ error: null, user: null, loading: false });

  onMounted(async () => {
    try {
      // Show loading indicator to user.
      state.value = { loading: true };

      // Fetch token from local storage.
      const token = getToken();
      if (!token) {
        // Absent token means user has not login.
        state.value = {};
        return;
      }

      // Fetch user from API.
      state.value = { user: await postAuthorize() };

      // A logged-in user cannot be on public restricted pages such as Login or Register.
      if (route.meta.isPublicRestricted) {
        router.replace({
          name: Routes.Private.name,
        });
      }
    } catch (error) {
      setToken(null);
      state.value = { error };
    } finally {
      // Only init router after the authorization is attempted.
      // The authorization does not need to be successful.
      // The purpose of delaying the router init logic is to prevent
      // redirection before the authorization is attempted.
      initRoute();
    }
  });

  async function login(name: string) {
    try {
      // Show loading state.
      state.value = { loading: true };

      // Login with the credentials.
      const accessToken = await postLogin(name);

      // Save token locally if successful.
      setToken(accessToken);

      // Set user state.
      state.value = { user: await postAuthorize() };

      // Redirect the user to the private page.
      router.push({
        path: route?.query?.redirect ?? Routes.Private.path,
      });
    } catch (error) {
      setToken(null);

      state.value = { error };
    }
  }

  async function logout() {
    // Clear token.
    setToken(null);

    // Reset value.
    state.value = {};

    // Redirect user to login page.
    router.push({
      name: Routes.Login.name,
    });
  }

  function initRoute() {
    router.beforeEach((to, from) => {
      // A logged-in user cannot be on public restricted pages such as Login/Register Page.
      if (to.meta.isPublicRestricted && state.value.user) {
        return {
          path: Routes.Private.path,
          // Ensures the back button cannot be pressed (though doesn't seem to work?).
          replace: true,
        };
      }

      // A non-logged-in user cannot be on private pages.
      if (to.meta.requiresAuth && !state.value.user) {
        return {
          path: Routes.Login.path,
          // Save the location we were at to come back later
          query: { redirect: to.fullPath },
          // Ensures the back button cannot be pressed (though doesn't seem to work?).
          replace: true,
        };
      }
    });
  }

  const action = {
    state: readonly(state),
    login,
    logout,
  };

  provide(AUTH_KEY, action);

  return action;
}
