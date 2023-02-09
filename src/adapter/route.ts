import { createRouter, createWebHistory } from "vue-router";
import { storage } from "@/features/token";

// Lazy load pages.
const Home = () => import("@/pages/Home.vue");
const Login = () => import("@/pages/Login.vue");
const Private = () => import("@/pages/Private.vue");

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      requiresAuth: false,
      // Public restricted routes are not accessible to
      // logged in users.
      isPublicRestricted: true,
    },
  },
  {
    path: "/private",
    name: "Private",
    component: Private,
    meta: {
      requiresAuth: true,
    },
  },
];

export const Routes = Object.fromEntries(
  routes.map((route) => [route.name, route])
);

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
