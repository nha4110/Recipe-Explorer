<!-- src/components/CombinedHome.vue -->
<template>
  <div class="p-3 border rounded shadow-sm bg-light" style="max-width: 300px;">
    <input
      type="text"
      class="form-control mb-3"
      placeholder="Search by title..."
      v-model="search"
      aria-label="Search recipes"
    />
    <select
      class="form-select"
      v-model="category"
      aria-label="Select category"
    >
      <option value="">All Categories</option>
      <option value="Dessert">Dessert</option>
      <option value="Main">Main</option>
      <option value="Vegan">Vegan</option>
    </select>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const search = ref('')
const category = ref('')
</script>
