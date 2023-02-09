<script setup lang="ts">
import { useAuth } from "@/features/auth";

const { logout } = useAuth();
</script>
<template>
  <h1>Admin</h1>
  <router-link to="/private">Private</router-link>
  <button @click="logout">Logout</button>
</template>
