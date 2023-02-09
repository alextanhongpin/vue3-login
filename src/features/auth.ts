import { inject, provide, readonly, onMounted, ref } from "vue";
import type { InjectionKey } from "vue";
import { getToken, setToken } from "@/features/token";
import { useRoute, useRouter } from "vue-router";
import { Routes } from "@/adapter/route";

type AuthState = {
  user?: {
    name: string;
  };
  error?: Error;
  loading?: boolean;
};

type AuthAction = {
  state: AuthState;
  login(name: string): void;
  logout(): void;
};

export const AUTH_KEY = Symbol() as InjectionKey<AuthAction>;

export function injectAuth() {
  return inject(AUTH_KEY);
}

async function delay(duration = 1000) {
  return new Promise((resolve) => window.setTimeout(resolve, duration));
}

async function mockAuth() {
  await delay(1_000);
  if (getToken() === "abc") {
    return { name: "john doe" };
  }

  throw new Error("unauthorized");
}

export function useAuth() {
  const router = useRouter();
  const route = useRoute();

  const state = ref({ error: null, user: null } as AuthState);

  onMounted(async () => {
    try {
      state.value = { loading: true };
      const token = getToken();
      if (!token) {
        return;
      }

      const user = await mockAuth();
      state.value = { user, error: null };
    } catch (error) {
      setToken(null);
      state.value = { user: null, error };
    } finally {
      // Only init router once the user is authorized.
      initRoute();
    }
  });

  async function login(name: string) {
    state.value = { loading: true };
    if (name !== "john") {
      state.value = {
        user: null,
        error: new Error("invalid username or password"),
      };
      return;
    }

    try {
      setToken("abc");
      const user = await mockAuth();
      state.value = { user, error: null };

      router.push({
        name: Routes.Private.name,
      });
    } catch (error) {
      setToken(null);
      state.value = { user: null, error };
    }
  }

  async function logout() {
    setToken(null);
    state.value = { user: null, error: null };

    router.push({
      name: Routes.Login.name,
    });
  }

  function initRoute() {
    router.beforeEach((to, from) => {
      if (to.meta.isPublicRestricted && state.value.user) {
        return {
          path: Routes.Private.path,
          replace: true,
        };
      }
      // instead of having to check every route record with
      // to.matched.some(record => record.meta.requiresAuth)
      if (to.meta.requiresAuth && !state.value.user) {
        if (to.name === Routes.Login.name) {
          return false;
        }

        // this route requires auth, check if logged in
        // if not, redirect to Home page.
        return {
          path: Routes.Login.path,
          // save the location we were at to come back later
          query: { redirect: to.fullPath },
          replace: true,
        };
      }
    });
    if (route.meta.isPublicRestricted && state.value.user) {
      router.replace({
        name: Routes.Private.name,
      });
    }
  }

  const action = {
    state: readonly(state),
    login,
    logout,
  };

  provide(AUTH_KEY, action);

  return action;
}
