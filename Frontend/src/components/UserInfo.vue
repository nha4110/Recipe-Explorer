<template>
  <div>
    <p><strong>Username:</strong> {{ user.username }}</p>
    <p><strong>Created At:</strong> {{ user.created_at }}</p>
  </div>
</template>

<script setup>
const props = defineProps(['user'])
</script>
