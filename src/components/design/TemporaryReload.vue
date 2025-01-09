  
  <script setup>
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// Get the current route and router instance
const route = useRoute();
const router = useRouter();

onMounted(() => {
  const targetRoute = route.query.targetRoute;
  if (targetRoute) {
    // Redirect to the target route after a short delay
    router.replace(JSON.parse(targetRoute));
  }
});
</script>

<template>
    <div>Loading...</div>
  </template>
