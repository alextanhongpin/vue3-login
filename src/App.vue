<script setup lang="ts">
import { provideAuth } from "@/features/auth";

// Initialize auth.
provideAuth();
</script>

<template>
  <!--All matched routes will be rendered here -->
  <router-view />
</template>

<style scoped></style>
