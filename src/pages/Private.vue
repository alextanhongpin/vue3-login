<script setup lang="ts">
import { useAuth } from "@/features/auth";

const { logout } = useAuth();
</script>
<template>
  <h1>Private</h1>
  <router-link to="/admin">Admin</router-link>
  <button @click="logout">Logout</button>
</template>
