<script setup lang="ts">
import { injectAuth } from "@/features/auth";

const { logout } = injectAuth();
</script>
<template>
  <h1>Private</h1>
  <button @click="logout">Logout</button>
</template>
