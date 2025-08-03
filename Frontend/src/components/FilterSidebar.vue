<!-- src/components/FilterSidebar.vue -->
<template>
  <div class="mb-4">
    <input
      type="text"
      class="form-control mb-2"
      placeholder="Search by title..."
      :value="search"
      @input="$emit('update:search', $event.target.value)"
    />
    <select class="form-select" :value="category" @change="$emit('update:category', $event.target.value)">
      <option value="">All Categories</option>
      <option value="Dessert">Dessert</option>
      <option value="Main">Main</option>
      <option value="Vegan">Vegan</option>
    </select>
  </div>
</template>

<script setup>
defineProps(['search', 'category'])
defineEmits(['update:search', 'update:category'])
</script>
