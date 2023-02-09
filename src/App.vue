<script setup lang="ts">
import { useAuth } from "@/features/auth";

// Initialize auth.
useAuth();
</script>

<template>
  <!--All matched routes will be rendered here -->
  <router-view />
</template>

<style scoped></style>
