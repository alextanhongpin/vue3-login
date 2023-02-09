<script setup lang="ts">
import { ref } from "vue";
import { injectAuth } from "@/features/auth";

const { state, login } = injectAuth();

const name = ref("");

function handleEnter() {
  login(name.value);
}
</script>

<template>
  <h1>Login</h1>

  <div v-if="state.error">
    Error:
    {{ state?.error?.message }}
  </div>
  <div v-if="state.loading">Loading...</div>
  <input
    type="text"
    v-model="name"
    @keydown.enter="handleEnter"
    placeholder="Enter your name"
  />
</template>
